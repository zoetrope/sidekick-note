package item

import org.json4s.{Extraction, FieldSerializer, DefaultFormats}
import org.json4s.ext.JodaTimeSerializers
import tag.SimpleTagSerializer
import auth.Permission

case class ItemForm(content: String)

//TODO: 名前が微妙なので変える
case class SearchCount(count: Long)

object ItemController extends CrudController[ItemForm, Item] {

  override implicit val formats = DefaultFormats +
    FieldSerializer[Item](FieldSerializer.ignore("words")) +
    new SimpleTagSerializer ++
    JodaTimeSerializers.all

  override def searchItem(accountId : Long, offset: Int, limit:Int, keywords:List[String], tags:List[String]) : List[Item] =
    Item.findByKeywordsAndTags(accountId, offset, limit, generateKeywords(keywords), tags)


  def count(words:String, tags:String) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val user = loggedIn
      val size = Item.countByKeywordsAndTags(user.accountId, generateKeywords(words.split(" ").toList), tags.split(" ").toList)
      play.Logger.info("count = " + size)
      Ok(Extraction.decompose(SearchCount(size))).as("application/json")
  }


}