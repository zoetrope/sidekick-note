package controllers

import models.{Permission, Tag}
import com.github.tototoshi.play2.json4s.native._
import org.json4s.{Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.AuthElement

object TagController extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats

  def getTags() = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>

      val tags = Tag.findAll()
      Ok(Extraction.decompose(tags)).as("application/json")
  }

}