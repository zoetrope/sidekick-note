package controllers

import models._
import org.json4s.{Extraction, FieldSerializer, DefaultFormats}
import org.json4s.ext.JodaTimeSerializers

case class ItemForm(content: String)
case class SearchCount(count: Long)

object ItemController extends BaseController[ItemForm, Item] {

  override implicit val formats = DefaultFormats +
    FieldSerializer[Item](FieldSerializer.ignore("words")) +
    new SimpleTagSerializer ++
    JodaTimeSerializers.all

  override def findByAccountId(accountId: Long, offset: Int, limit: Int) = {
    null
  }
  override def createInstance(user: User, form : ItemForm) : Item = {
    null
  }
  override def updateInstance(item: Item, form : ItemForm) = {

  }
  override def findById(itemId: Long): Option[Task] = {
    null
  }

  override def searchItem(accountId : Long, offset: Int, limit:Int, keywords:List[String], tags:List[String]) : List[Item] =
    Item.findByKeywordsAndTags(accountId, offset, limit, generateKeywords(keywords), tags)


  def count(words:String, tags:String) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val user = loggedIn
      val size = Item.countByKeywordsAndTags(user.accountId, words, tags.split(" ").toList)
      play.Logger.info("count = " + size)
      Ok(Extraction.decompose(SearchCount(size))).as("application/json")
  }


}