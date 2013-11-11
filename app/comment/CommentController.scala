package comment

import org.json4s.{FieldSerializer, DefaultFormats}
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import task.TaskStatusSerializer
import tag.SimpleTagSerializer
import item.CrudController

case class CommentForm
(
  content: String,
  parentId: Long
)

object CommentController extends CrudController[CommentForm, Comment] {

  override implicit val formats = DefaultFormats +
    FieldSerializer[Comment](FieldSerializer.ignore("words")) +
    new SimpleTagSerializer +
    new TaskStatusSerializer ++
    JodaTimeSerializers.all

  override def createInstance(user: User, form : CommentForm) : Comment = {

    val words = separateWords(form.content)
    play.Logger.info(words)

    //DB localTx{
    val Comment = comment.Comment.create(
      form.content,
      words,
      0,
      DateTime.now(),
      DateTime.now(),
      Option.empty[DateTime],
      user.accountId,
      form.parentId)

    //}
    Comment
  }
  override def findById(itemId: Long): Option[Comment] = Comment.find(itemId)

  override def updateInstance(Comment: Comment, form : CommentForm) = {
    Comment.content = form.content
    Comment.modifiedAt = DateTime.now()
    Comment.words = separateWords(Comment.content)

    //TODO: transaction
    //DB localTx{
    Comment.save()
    //}
  }

}