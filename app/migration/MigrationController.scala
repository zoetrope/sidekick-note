package migration


import com.github.tototoshi.play2.json4s.native._
import org.json4s.{FieldSerializer, Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.AuthElement
import auth.{Permission, AuthConfigImpl}
import quick_note.QuickNote
import article.Article
import task.{TaskStatusSerializer, Task}
import tag.SimpleTagSerializer
import org.json4s.ext.JodaTimeSerializers

object MigrationController extends Controller with AuthElement with AuthConfigImpl with Json4s {

  implicit val formats = DefaultFormats +
    FieldSerializer[QuickNote](FieldSerializer.ignore("words")) +
    FieldSerializer[Article](FieldSerializer.ignore("words")) +
    FieldSerializer[Task](FieldSerializer.ignore("words")) +
    new SimpleTagSerializer +
    new TaskStatusSerializer ++
    JodaTimeSerializers.all

  def getQuickNotes() = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val tags = QuickNote.findAll()
      Ok(Extraction.decompose(tags)).as("application/json")
  }

  def getArticles() = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val tags = Article.findAll()
      Ok(Extraction.decompose(tags)).as("application/json")
  }

  def getTasks() = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val tags = Task.findAll()
      Ok(Extraction.decompose(tags)).as("application/json")
  }

}