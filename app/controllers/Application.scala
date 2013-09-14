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

  def main(title : String) = Action { implicit request =>
    Ok(views.html.main(title))
  }

  def javascriptRoutes() = Action { implicit request =>
    import play.api.Routes
    Ok(
      Routes.javascriptRouter("jsRouter")(
        routes.javascript.ItemController.items,
        routes.javascript.ItemController.newItem,
        routes.javascript.UserController.authenticate,
        routes.javascript.UserController.logout
      )
    ).as("text/javascript")
  }
}