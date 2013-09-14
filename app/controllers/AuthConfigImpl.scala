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

  def loginSucceeded(request: RequestHeader) = Redirect(routes.Application.main(""))

  def logoutSucceeded(request: RequestHeader) = Redirect(routes.Application.main(""))

  def authenticationFailed(request: RequestHeader) = Unauthorized("unauthorized")

  def authorizationFailed(request: RequestHeader) = Forbidden("no permission")

  def authorize(user: User, authority: Authority) = (user.permission, authority) match {
    case (Administrator, _) => true
    case (NormalUser, NormalUser) => true
    case _ => false
  }

}