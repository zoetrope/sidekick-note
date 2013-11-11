package application

import com.github.tototoshi.play2.json4s.native._
import org.json4s.{Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.{LoginLogout, OptionalAuthElement}
import scala.concurrent.{ExecutionContext, Future}
import ExecutionContext.Implicits.global
import auth.{PermissionSerializer, AuthConfigImpl}
import user.Account

case class LoginForm(name: String, password: String)

object Application extends Controller with OptionalAuthElement with LoginLogout with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats + new PermissionSerializer

  def main(title: String) = Action {
    implicit request =>
      Ok(views.html.main(title))
  }

  def logout = Action.async {
    implicit request =>
      play.Logger.info("logout")
      gotoLogoutSucceeded
  }

  def authenticate = Action.async(json) {
    implicit request =>
      val login: LoginForm = request.body.extract[LoginForm]

      play.Logger.info("login! = " + org.json4s.native.JsonMethods.compact(org.json4s.native.JsonMethods.render(request.body)))

      Account.authenticate(login.name, login.password) match {
        case Some(account) => {
          play.Logger.info("authenticate succeeded = " + account)
          gotoLoginSucceeded(account.accountId)
        }
        case None => {
          play.Logger.info("authenticate failed")
          Future.successful(BadRequest)
        }
      }
  }

  def loggedin = StackAction {
    implicit request =>
      val maybeUser: Option[User] = loggedIn
      maybeUser match {
        case Some(user) => {
          play.Logger.info("loggedin OK!")
          Ok(Extraction.decompose(user)).as("application/json")
        }
        case None => {
          play.Logger.info("loggedin NG!")
          Ok(Extraction.decompose({})).as("application/json")
        }
      }
  }

}