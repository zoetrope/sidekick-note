package controllers

import models.{Permission, Account}
import play.api.mvc._
import play.api.mvc.Results._
import jp.t2v.lab.play2.auth._
import reflect.classTag
import org.json4s._
import com.github.tototoshi.play2.json4s.native.Json4s

case class AccessUrl(url: String)

trait AuthConfigImpl extends AuthConfig with Json4s {
  type Id = Long

  type User = Account

  type Authority = Permission

  val idTag = classTag[Id]

  val sessionTimeoutInSeconds = 3600

  def resolveUser(id: Id) = Account.findById(id)

  def loginSucceeded(request: RequestHeader) = {
    implicit val formats = DefaultFormats

    play.Logger.debug("loginSucceeded")
    val uri = request.session.get("access_uri").getOrElse("/item")
    Ok(Extraction.decompose(AccessUrl(url = uri))).as("application/json").withSession(request.session - "access_uri")
  }

  def logoutSucceeded(request: RequestHeader) = {
    play.Logger.debug("logoutSucceeded")
    Redirect(routes.Application.main(""))
  }

  def authenticationFailed(request: RequestHeader) = {
    play.Logger.debug("Authentication failed")
    val uri = request.headers.get("REFERER").getOrElse(request.uri)
    Unauthorized("Authentication failed").withSession("access_uri" -> uri)
  }

  def authorizationFailed(request: RequestHeader) = {
    play.Logger.debug("authorizationFailed")
    Forbidden("no permission")
  }

  def authorize(user: User, authority: Authority) = (user.permission, authority) match {
    case (Permission.Administrator, _) => true
    case (Permission.NormalUser, Permission.NormalUser) => true
    case _ => false
  }

}