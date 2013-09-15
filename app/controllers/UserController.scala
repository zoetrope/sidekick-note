package controllers

import org.json4s.{DefaultFormats, Extraction}
import play.api.mvc.{Action, Controller}
import com.github.tototoshi.play2.json4s.native.Json4s
import org.json4s.native.JsonMethods._
import jp.t2v.lab.play2.auth.LoginLogout
import models.Account

object UserController extends Controller with LoginLogout with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats


}
