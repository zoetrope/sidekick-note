package user

import org.json4s.DefaultFormats
import play.api.mvc.Controller
import com.github.tototoshi.play2.json4s.native.Json4s
import jp.t2v.lab.play2.auth.LoginLogout
import auth.AuthConfigImpl

object UserController extends Controller with LoginLogout with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats


}
