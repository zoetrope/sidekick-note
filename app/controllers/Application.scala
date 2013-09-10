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
import models.Item
import org.joda.time.DateTime

object Application extends Controller with Json4s {

  implicit val formats = DefaultFormats

  val itemForm = Form(
    mapping(
      "id" -> ignored(0L),
      "content"  -> nonEmptyText,
      "created" -> ignored(DateTime.now()),
      "modified" -> ignored(DateTime.now()),
      "deleted" -> ignored(Option.empty[DateTime])
    )(Item.apply)(Item.unapply)
  )

  def index = Action { implicit request =>
    Ok(views.html.index(this.itemForm))
  }

  def items = Action { implicit request =>
    val items = Item.findAll()
    Ok(Extraction.decompose(items)).as("application/json")
  }

  def newItem = Action { implicit request =>

    val item = itemForm.bindFromRequest.value map { item =>
      Item.create(item.content, item.created, item.modified)
    }

    Ok(Extraction.decompose(item)).as("application/json")
  }

  def javascriptRoutes() = Action { implicit request =>
    import play.api.Routes
    Ok(
      Routes.javascriptRouter("jsRouter")(
        routes.javascript.Application.items,
        routes.javascript.Application.newItem
      )
    ).as("text/javascript")
  }
  
}