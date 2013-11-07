package controllers

import models._
import org.json4s.{FieldSerializer, Extraction, DefaultFormats}
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import org.joda.time.format.DateTimeFormat
import scala.Some
import play.api.mvc.Controller
import jp.t2v.lab.play2.auth.AuthElement
import com.github.tototoshi.play2.json4s.native.Json4s

case class TaskForm
(
  content: String,
  tags: Seq[String],
  rate: Int,
  status: String,
  dueDate: String,
  title: String
)

object TaskController extends CrudController[TaskForm, Task] {

  override implicit val formats = DefaultFormats +
    FieldSerializer[Task](FieldSerializer.ignore("words")) +
    new SimpleTagSerializer +
    new TaskStatusSerializer ++
    JodaTimeSerializers.all

  override def findByAccountId(accountId: Long, offset: Int, limit: Int) = {
    Task.findByAccountId(accountId, offset, limit)
  }

  override def createInstance(user: User, form : TaskForm) : Task = {

    val words = separateWords(form.content)
    play.Logger.info(words)
    val dueDate = parseDate(form.dueDate)

    //TODO: DB localTx{
    val task = Task.create(
      form.content,
      words,
      form.rate,
      DateTime.now(),
      DateTime.now(),
      Option.empty[DateTime],
      user.accountId,
      TaskStatus.valueOf(form.status),
      dueDate,
      Option.empty[DateTime],
      form.title
    )

    form.tags.distinct.foreach(tagName => {
      task.addTag(tagName)
    })
    //}
    task
  }
  override def findById(itemId: Long): Option[Task] = Task.find(itemId)

  override def updateInstance(task: Task, form : TaskForm) = {
    task.content = form.content
    task.modifiedAt = DateTime.now()
    task.rate = form.rate

    task.words = separateWords(task.content)
    val status = parseStatus(form.status, task.status)
    if ((task.status != status) && (status == TaskStatus.Completed)) {
      task.completedAt = Some(DateTime.now)
    }
    task.status = status
    task.dueDate = parseDate(form.dueDate)
    task.title = form.title

    //TODO: transaction
    //DB localTx{
    task.save()
    updateTags(task, form.tags)
    //}
  }

  override def searchItem(accountId : Long, offset: Int, limit:Int, keywords:List[String],  tags:List[String]) : List[Task] =
    Task.findByKeywordsAndTags(accountId, offset, limit, generateKeywords(keywords), tags)

  def count(words:String, tags:String) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val user = loggedIn
      val size = Task.countByKeywordsAndTags(user.accountId, generateKeywords(words.split(" ").toList), tags.split(" ").toList)
      play.Logger.info("count = " + size)
      Ok(Extraction.decompose(SearchCount(size))).as("application/json")
  }

  protected def parseStatus(input: String, defaultStatus: TaskStatus) : TaskStatus = {
    try {
      TaskStatus.valueOf(input)
    } catch {
      case _: Throwable => defaultStatus
    }
  }

}

object SearchTaskController extends Controller with AuthElement with AuthConfigImpl {

  implicit val formats = DefaultFormats +
    new SimpleTagSerializer +
    new TaskStatusSerializer ++
    JodaTimeSerializers.all

  def search(page: Int, tags:String, status:String, dueDate:String) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val limit = 200
      val offset = (page - 1) * limit

      val user = loggedIn
      val tasks = SummarizedTask.findByKeywordsAndTags(user.accountId, offset, limit, tags.split(" ").toList, status, dueDate)

      play.Logger.info("find item size = " + tasks.size)
      Ok(Extraction.decompose(tasks)).as("application/json")
  }

}