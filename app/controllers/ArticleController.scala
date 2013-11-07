package controllers

import models._
import org.json4s.{FieldSerializer, Extraction, DefaultFormats}
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import org.joda.time.format.DateTimeFormat
import scala.Some

case class ArticleForm
(
  content: String,
  tags: Seq[String],
  rate: Int,
  title: String)

object ArticleController extends CrudController[ArticleForm, Article] {

  override implicit val formats = DefaultFormats +
    FieldSerializer[Article](FieldSerializer.ignore("words")) +
    new SimpleTagSerializer +
    new TaskStatusSerializer ++
    JodaTimeSerializers.all

  override def findByAccountId(accountId: Long, offset: Int, limit: Int) = {
    Article.findByAccountId(accountId, offset, limit)
  }

  override def createInstance(user: User, form : ArticleForm) : Article = {

    val words = separateWords(form.content)
    play.Logger.info(words)

    //DB localTx{
    val article = Article.create(
      form.content,
      words,
      form.rate,
      DateTime.now(),
      DateTime.now(),
      Option.empty[DateTime],
      user.accountId,
      form.title)

    form.tags.distinct.foreach(tagName => {
      article.addTag(tagName)
    })
    //}
    article
  }
  override def findById(itemId: Long): Option[Article] = Article.find(itemId)

  override def updateInstance(article: Article, form : ArticleForm) = {
    article.content = form.content
    article.modifiedAt = DateTime.now()
    article.rate = form.rate

    article.words = separateWords(article.content)

    article.title = form.title

    //TODO: transaction
    //DB localTx{
    article.save()
    updateTags(article, form.tags)
    //}
  }

  override def searchItem(accountId : Long, offset: Int, limit:Int, keywords:List[String],  tags:List[String]) =
    Article.findByTags(accountId, offset, limit, tags)

  def allTitles = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val user = loggedIn
      val titles = Article.getAllTitles(user.accountId)
      Ok(Extraction.decompose(titles)).as("application/json")
  }
}