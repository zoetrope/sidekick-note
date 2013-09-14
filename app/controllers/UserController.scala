package controllers

import org.json4s.{DefaultFormats, Extraction}
import play.api.mvc.{Action, Controller}
import com.github.tototoshi.play2.json4s.native.Json4s
import org.json4s.native.JsonMethods._
import jp.t2v.lab.play2.auth.LoginLogout
import models.Account

case class Login(name: String, password: String)

object UserController extends Controller with LoginLogout with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats

  def index = Action { implicit request =>
    Ok(views.html.login())
  }

  def logout = Action { implicit request =>
    gotoLogoutSucceeded
  }

  def authenticate = Action(json) { implicit request =>
    val login : Login = request.body.extract[Login]

    play.Logger.error("login! = " + org.json4s.native.JsonMethods.compact(org.json4s.native.JsonMethods.render(request.body)))

    Account.authenticate(login.name, login.password) match {
      case Some(account) => {
        play.Logger.error("authenticate succeeded = " + account)
        gotoLoginSucceeded(account.id)
      }
      case None => BadRequest(views.html.main(""))
    }
  }
}
