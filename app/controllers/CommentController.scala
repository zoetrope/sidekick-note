package controllers

import models._
import com.github.tototoshi.play2.json4s.native._
import org.json4s.{FieldSerializer, Extraction, DefaultFormats}
import play.api.mvc._
import jp.t2v.lab.play2.auth.AuthElement
import org.json4s.native.JsonMethods
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import net.java.sen.SenFactory
import net.java.sen.dictionary.Token
import scala.collection.JavaConversions._

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
    val Comment = models.Comment.create(
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