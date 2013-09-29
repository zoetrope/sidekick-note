package controllers

import models.{Tag, NormalUser}
import com.github.tototoshi.play2.json4s.native._
import org.json4s.{Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.AuthElement
import org.json4s.native.Serialization
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import net.java.sen.SenFactory
import net.java.sen.StringTagger
import net.java.sen.dictionary.Token
import scala.collection.JavaConversions._

object TagController extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats

  def getTags() = StackAction(AuthorityKey -> NormalUser) {
    implicit request =>

      val tags = Tag.findAll()
      Ok(Extraction.decompose(tags)).as("application/json")
  }

}