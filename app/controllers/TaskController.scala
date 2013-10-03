package controllers

import models._
import com.github.tototoshi.play2.json4s.native._
import org.json4s.{Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.AuthElement
import org.json4s.native.{JsonMethods, Serialization}
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import net.java.sen.SenFactory
import net.java.sen.StringTagger
import net.java.sen.dictionary.Token
import scala.collection.JavaConversions._
import scalikejdbc.DB
import org.joda.time.format.DateTimeFormat

case class TaskForm
(
  content: String,
  tags: Seq[String],
  rate: Int,
  status: String,
  dueDate: String
)

object TaskController extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats + new TaskStatusSerializer ++ JodaTimeSerializers.all

  def getTasks(page: Int) = StackAction(AuthorityKey -> NormalUser) {
    implicit request =>

      if (page < 1) {
        play.Logger.error("invalid page number")
        BadRequest("invalid page number")
      }

      val limit = 5
      val offset = (page - 1) * limit

      val user = loggedIn
      val tasks = Task.findByAccountId(user.accountId, offset, limit)
      Ok(Extraction.decompose(tasks)).as("application/json")
  }

  def addTask = StackAction(json, AuthorityKey -> NormalUser) {
    implicit request =>
      play.Logger.info("addTask entry")
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))

      val user = loggedIn
      val form = request.body.extract[TaskForm]

      val tagger = SenFactory.getStringTagger(null)
      val tokens = new java.util.ArrayList[Token]()
      tagger.analyze(form.content, tokens)

      val words = tokens.map(x=>x.getSurface).mkString(" ")
      play.Logger.info(words)

      val dueDate = try{
        Some(DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z").parseDateTime(form.dueDate))
      } catch {
        case _ : Throwable => Option.empty[DateTime]
      }
      //DB localTx{
      val task = Task.create(
        form.content,
        words,
        form.rate,
        DateTime.now(),
        DateTime.now(),
        Option.empty[DateTime],
        user.accountId,
        TaskStatus.valueOf(form.status),
        dueDate)

      form.tags.foreach(tagName => {
        val tag = Tag.getOrCreate(tagName)
        ItemTag.addTag(task.itemId, tag)
      })
      //}

      play.Logger.info("addQuickNote exit")
      Ok(Extraction.decompose(task)).as("application/json")
  }

  def updateTask(itemId: Int) = StackAction(json, AuthorityKey -> NormalUser) {
    implicit request =>

      play.Logger.debug("update task itemId = " + itemId)
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))
    Ok
  }
}