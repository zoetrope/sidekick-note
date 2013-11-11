package search_criterion

import play.api.mvc.Controller
import jp.t2v.lab.play2.auth.AuthElement
import com.github.tototoshi.play2.json4s.native.Json4s
import org.json4s.{Extraction, DefaultFormats}
import org.json4s.native.JsonMethods
import org.joda.time.DateTime
import auth.{Permission, AuthConfigImpl}

case class SearchCriterionForm
(
  title: String,
  query: String,
  sortOrder: Int
)

object SearchCriterionController  extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats

  def all(target: String) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>

      play.Logger.debug("target = " + target)
      val user = loggedIn
      val criteria = SearchCriterion.findAll(user.accountId, target)
      Ok(Extraction.decompose(criteria)).as("application/json")
  }

  def create(target: String) = StackAction(json, AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      play.Logger.debug("target = " + target)
      play.Logger.debug(JsonMethods.compact(JsonMethods.render(request.body)))

      val user = loggedIn
      val form = request.body.extract[SearchCriterionForm]

      val criterion = SearchCriterion.create(
        form.title,
        target,
        Option(form.query),
        user.accountId,
        form.sortOrder,
        DateTime.now(),
        Option.empty[DateTime]
      )

      Ok(Extraction.decompose(criterion)).as("application/json")
  }

}