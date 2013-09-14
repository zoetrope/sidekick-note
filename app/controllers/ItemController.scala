package controllers

import play.api._
import play.api.mvc._
import com.github.tototoshi.play2.json4s.native._
import play.api.data.Form
import org.json4s.{Extraction, DefaultFormats}
import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Form
import play.api.data.Forms._
import models.{NormalUser, Item}
import org.joda.time.DateTime
import jp.t2v.lab.play2.auth.AuthElement

case class ItemForm(content: String)

object ItemController extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats

  def index = Action { implicit request =>
    Ok(views.html.item())
  }

  //def items = StackAction(json, AuthorityKey -> NormalUser) { implicit request =>
  def items = Action { implicit request =>
    play.Logger.info("items")
    val items = Item.findAll()
    play.Logger.info("items length = " + items.length)
    Ok(Extraction.decompose(items)).as("application/json")
  }

  def newItem = Action(json) { implicit request =>
    play.Logger.info("newitem")
    val form : ItemForm = request.body.extract[ItemForm]

    val item = Item.create(form.content, DateTime.now(),DateTime.now())

    Ok(Extraction.decompose(item)).as("application/json")
  }

}