package controllers

import models.{Permission, Administrator, NormalUser, Account}
import play.api.mvc._
import play.api.mvc.Results._
import jp.t2v.lab.play2.auth._
import reflect.classTag

trait AuthConfigImpl extends AuthConfig {

  type Id = Long

  type User = Account

  type Authority = Permission

  val idTag = classTag[Id]

  val sessionTimeoutInSeconds = 3600

  def resolveUser(id: Id) = Account.findById(id)

  def loginSucceeded(request: RequestHeader) = {
    play.Logger.debug("loginSucceeded")
    Redirect(routes.Application.main(""))
  }

  def logoutSucceeded(request: RequestHeader) = {
    play.Logger.debug("logoutSucceeded")
    Redirect(routes.Application.main(""))
  }

  def authenticationFailed(request: RequestHeader) = {
    play.Logger.debug("Authentication failed")
    Unauthorized("Authentication failed")
  }

  def authorizationFailed(request: RequestHeader) = {
    play.Logger.debug("authorizationFailed")
    Forbidden("no permission")
  }

  def authorize(user: User, authority: Authority) = (user.permission, authority) match {
    case (Administrator, _) => true
    case (NormalUser, NormalUser) => true
    case _ => false
  }

}