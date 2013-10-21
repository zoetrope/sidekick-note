package controllers

import play.api.mvc.Controller
import jp.t2v.lab.play2.auth.AuthElement
import com.github.tototoshi.play2.json4s.native.Json4s
import org.json4s.{Extraction, DefaultFormats}
import models.{SearchCondition, Tag, Permission}
import org.json4s.native.JsonMethods
import org.joda.time.DateTime

case class SearchConditionForm
(
  title: String,
  targetType: String,
  keywords: String,
  tags: String,
  sortOrder: Int
)

object SearchConditionController  extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats

  def all() = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>

      val conds = SearchCondition.findAll()
      Ok(Extraction.decompose(conds)).as("application/json")
  }

  def create() = StackAction(json, AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))

      val user = loggedIn
      val form = request.body.extract[SearchConditionForm]

      val cond = SearchCondition.create(
        form.title,
        form.targetType,
        Option(form.keywords),
        Option(form.tags),
        user.accountId,
        form.sortOrder,
        DateTime.now(),
        Option.empty[DateTime]
      )

      Ok(Extraction.decompose(cond)).as("application/json")
  }

}