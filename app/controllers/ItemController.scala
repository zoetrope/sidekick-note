package controllers

import models.{NormalUser, Item}
import com.github.tototoshi.play2.json4s.native._
import org.json4s.{Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.AuthElement
import org.json4s.native.Serialization
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers

case class ItemForm(content: String)

object ItemController extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats ++ JodaTimeSerializers.all
  //implicit val formats = DefaultFormats

  def view = StackAction(AuthorityKey -> NormalUser) { implicit request =>
    Ok(views.html.item())
  }

  def items = StackAction(AuthorityKey -> NormalUser) { implicit request =>
    play.Logger.info("items")
    val user = loggedIn
    val items = Item.findByAccountId(user.id, 0, 5)
    play.Logger.info("items length = " + items.length)
    play.Logger.info(Serialization.write(items))
    Ok(Extraction.decompose(items)).as("application/json")
  }

  def newItem = StackAction(json, AuthorityKey -> NormalUser) {
    implicit request =>
      play.Logger.info("newitem")
      val user = loggedIn
      val form: ItemForm = request.body.extract[ItemForm]
      val item = Item.create(form.content, DateTime.now(), DateTime.now(), Option.empty[DateTime], user.id)
      Ok(Extraction.decompose(item)).as("application/json")
  }

}