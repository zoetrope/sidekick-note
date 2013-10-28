package controllers


import models._
import com.github.tototoshi.play2.json4s.native._
import org.json4s.{Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.AuthElement
import org.json4s.native.JsonMethods
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import net.java.sen.SenFactory
import net.java.sen.dictionary.Token
import scala.collection.JavaConversions._
import org.joda.time.format.DateTimeFormat
import scala.Some

abstract class BaseController[TInput : Manifest, TOutput <: Item] extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats +
    new SimpleTagSerializer +
    new TaskStatusSerializer ++
    JodaTimeSerializers.all

  def all(page: Int) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>

      if (page < 1) {
        play.Logger.error("invalid page number")
        BadRequest("invalid page number")
      }
      else {
        val limit = 200
        val offset = (page - 1) * limit

        val user = loggedIn
        val items = findByAccountId(user.accountId, offset, limit)
        Ok(Extraction.decompose(items)).as("application/json")
      }
  }

  def create = StackAction(json, AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))

      val user = loggedIn
      val form = request.body.extract[TInput]

      val item = createInstance(user, form)

      Ok(Extraction.decompose(item)).as("application/json")
  }

  def update(itemId: Int) = StackAction(json, AuthorityKey -> Permission.NormalUser) {
    implicit request =>

      play.Logger.debug("update task itemId = " + itemId)
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))

      findById(itemId) match {
        case None => BadRequest
        case Some(task) => {
          val user = loggedIn
          if (task.accountId != user.accountId) {
            Forbidden
          } else {
            val form = request.body.extract[TInput]
            updateInstance(task, form)
            Ok
          }
        }
      }
  }

  def search(page: Int, words:String, tags:String) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      play.Logger.info("words=" + words)
      play.Logger.info("tags=" + tags)

      if (page < 1) {
        play.Logger.error("invalid page number")
        BadRequest("invalid page number")
      } else {
        val limit = 20
        val offset = (page - 1) * limit

        val user = loggedIn
        val items = searchItem(user.accountId, offset, limit, words.split(" ").toList, tags.split(" ").toList)

        play.Logger.info("find item size = " + items.size)
        Ok(Extraction.decompose(items)).as("application/json")
      }
  }

  protected def findByAccountId(accountId: Long, offset: Int, limit: Int): List[TOutput]

  protected def createInstance(user: User, form : TInput) : TOutput

  protected def findById(itemId: Long): Option[TOutput]

  protected def updateInstance(item: TOutput, form : TInput) : Unit

  protected def searchItem(accountId : Long, offset: Int, limit:Int, keywords:List[String], tags:List[String]) : List[TOutput]

  protected def updateTags(item: TOutput, tags:Seq[String]) = {
    val formTags = tags.distinct
    val orgTags = item.tags.map(tag=>tag.name)
    val addTags = formTags diff orgTags
    val remTags = orgTags diff formTags
    addTags.foreach(tag => item.addTag(tag))
    remTags.foreach(tag => item.deleteTag(tag))
  }

  protected def parseDate(input: String) : Option[DateTime] = {
    try {
      Some(DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z").parseDateTime(input))
    } catch {
      case _: Throwable => Option.empty[DateTime]
    }
  }

  protected def separateWords(input: String) : String = {
    val tagger = SenFactory.getStringTagger(null)
    val tokens = new java.util.ArrayList[Token]()
    tagger.analyze(input, tokens)
    tokens.map(x => x.getSurface).mkString(" ")
  }

  //TODO: articleのタイトルやタグもwordsに含めるためのメソッドを用意する

  protected def generateKeywords(inputs: List[String]) : String = {
    val tagger = SenFactory.getStringTagger(null)
    inputs.filter(s => s != null && !s.isEmpty).map(input => {
      val tokens = new java.util.ArrayList[Token]()
      tagger.analyze(input, tokens)
      "+\"" + tokens.map(x => x.getSurface).mkString(" ") + "\""
    }).mkString(" ");
  }
}
