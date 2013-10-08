package controllers

import models._
import com.github.tototoshi.play2.json4s.native._
import org.json4s.{FieldSerializer, Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.AuthElement
import org.json4s.native.JsonMethods
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import net.java.sen.SenFactory
import net.java.sen.dictionary.Token
import scala.collection.JavaConversions._
import org.joda.time.format.DateTimeFormat
import play.api.mvc.Results._
import scala.Some
import play.api.mvc.Result

case class TaskForm
(
  content: String,
  tags: Seq[String],
  rate: Int,
  status: String,
  dueDate: String
  )

object TaskController extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats +
    FieldSerializer[Task](FieldSerializer.ignore("words")) +
    new SimpleTagSerializer +
    new TaskStatusSerializer ++
    JodaTimeSerializers.all

  def getTasks(page: Int) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>

      if (page < 1) {
        play.Logger.error("invalid page number")
        BadRequest("invalid page number")
      }

      val limit = 100
      val offset = (page - 1) * limit

      val user = loggedIn
      val tasks = Task.findByAccountId(user.accountId, offset, limit)
      Ok(Extraction.decompose(tasks)).as("application/json")
  }

  def addTask = StackAction(json, AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      play.Logger.info("addTask entry")
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))

      val user = loggedIn
      val form = request.body.extract[TaskForm]

      val tagger = SenFactory.getStringTagger(null)
      val tokens = new java.util.ArrayList[Token]()
      tagger.analyze(form.content, tokens)

      val words = tokens.map(x => x.getSurface).mkString(" ")
      play.Logger.info(words)

      val dueDate = try {
        Some(DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z").parseDateTime(form.dueDate))
      } catch {
        case _: Throwable => Option.empty[DateTime]
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
        dueDate,
        Option.empty[DateTime])

      form.tags.distinct.foreach(tagName => {
        task.addTag(tagName)
      })
      //}

      play.Logger.info("addQuickNote exit")
      Ok(Extraction.decompose(task)).as("application/json")
  }

  def updateTask(itemId: Int) = StackAction(json, AuthorityKey -> Permission.NormalUser) {
    implicit request =>

      play.Logger.debug("update task itemId = " + itemId)
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))

      Task.find(itemId) match {
        case None => BadRequest
        case Some(task) => {
          val user = loggedIn
          if (task.accountId != user.accountId) {
            Forbidden
          } else {
            val form = request.body.extract[TaskForm]
            task.content = form.content
            task.modifiedAt = DateTime.now()
            task.rate = form.rate

            //task.words =
            val status = try {
              TaskStatus.valueOf(form.status)
            } catch {
              case _: Throwable => task.status
            }
            if ((task.status != status) && (status == TaskStatus.Completed)) {
              task.completedAt = Some(DateTime.now)
            }
            task.status = status;

            task.dueDate = try {
              Some(DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z").parseDateTime(form.dueDate))
            } catch {
              case _: Throwable => task.dueDate
            }
            //TODO: transaction
            task.save()

            // update tags
            val formTags = form.tags.distinct
            val orgTags = task.tags.map(tag=>tag.name)
            val addTags = formTags diff orgTags
            val remTags = orgTags diff formTags
            addTags.foreach(tag => task.addTag(tag))
            remTags.foreach(tag => task.deleteTag(tag))

            Ok
          }
        }
      }
  }


  def search(words:String, tags:String) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      play.Logger.info("words=" + words)
      play.Logger.info("tags=" + tags)

      val limit = 100
      val offset = 0

      val user = loggedIn
      val tasks = Task.findByTags(user.accountId, offset, limit, tags.split(" ").toList)
      Ok(Extraction.decompose(tasks)).as("application/json")
  }
}