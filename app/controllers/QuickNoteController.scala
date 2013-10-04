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

case class QuickNoteForm
(
  content: String,
  tags: Seq[String],
  rate: Int
  )

object QuickNoteController extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats + FieldSerializer[QuickNote](FieldSerializer.ignore("words")) ++ JodaTimeSerializers.all

  def getQuickNotes(page: Int) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>

      if (page < 1) {
        play.Logger.error("invalid page number")
        BadRequest("invalid page number")
      }

      val limit = 5
      val offset = (page - 1) * limit

      val user = loggedIn
      val quick_notes = QuickNote.findByAccountId(user.accountId, offset, limit)
      Ok(Extraction.decompose(quick_notes)).as("application/json")
  }

  def addQuickNote = StackAction(json, AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      play.Logger.info("addQuickNote entry")
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))

      val user = loggedIn
      val form = request.body.extract[QuickNoteForm]

      val tagger = SenFactory.getStringTagger(null)
      val tokens = new java.util.ArrayList[Token]()
      tagger.analyze(form.content, tokens)

      val words = tokens.map(x => x.getSurface).mkString(" ")
      play.Logger.info(words)

      //DB localTx{
      val quick_note = QuickNote.create(
        form.content, words, form.rate, DateTime.now(), DateTime.now(), Option.empty[DateTime], user.accountId)

      form.tags.foreach(tagName => {
        val tag = Tag.getOrCreate(tagName)
        ItemTag.addTag(quick_note.itemId, tag)
      })
      //}

      play.Logger.info("addQuickNote exit")
      Ok(Extraction.decompose(quick_note)).as("application/json")
  }

}