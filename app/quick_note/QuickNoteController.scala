package quick_note

import org.json4s.{FieldSerializer, Extraction, DefaultFormats}
import org.joda.time._
import org.json4s.ext.JodaTimeSerializers
import task.TaskStatusSerializer
import tag.SimpleTagSerializer
import auth.Permission
import item.{SearchCount, CrudController}

case class QuickNoteForm
(
  content: String,
  tags: Seq[String],
  rate: Int
  )

object QuickNoteController extends CrudController[QuickNoteForm, QuickNote] {

  override implicit val formats = DefaultFormats +
    FieldSerializer[QuickNote](FieldSerializer.ignore("words")) +
    new SimpleTagSerializer +
    new TaskStatusSerializer ++
    JodaTimeSerializers.all

  override def findByAccountId(accountId: Long, offset: Int, limit: Int) = {
    QuickNote.findByAccountId(accountId, offset, limit)
  }

  override def createInstance(user: User, form : QuickNoteForm) : QuickNote = {

    val words = separateWords(form.content)
    play.Logger.info(words)

    //DB localTx{
    val quickNote = QuickNote.create(
      form.content,
      words,
      form.rate,
      DateTime.now(),
      DateTime.now(),
      Option.empty[DateTime],
      user.accountId)

    form.tags.distinct.foreach(tagName => {
      quickNote.addTag(tagName)
    })
    //}
    quickNote
  }
  override def findById(itemId: Long): Option[QuickNote] = QuickNote.find(itemId)

  override def updateInstance(quickNote: QuickNote, form : QuickNoteForm) = {
    quickNote.content = form.content
    quickNote.modifiedAt = DateTime.now()
    quickNote.rate = form.rate

    quickNote.words = separateWords(quickNote.content)

    //TODO: transaction
    //DB localTx{
    quickNote.save()
    updateTags(quickNote, form.tags)
    //}
  }

  override def searchItem(accountId : Long, offset: Int, limit:Int, keywords:List[String],  tags:List[String]) =
    QuickNote.findByKeywordsAndTags(accountId, offset, limit, generateKeywords(keywords), tags)


  def count(words:String, tags:String) = StackAction(AuthorityKey -> Permission.NormalUser) {
    implicit request =>
      val user = loggedIn
      val size = QuickNote.countByKeywordsAndTags(user.accountId, generateKeywords(words.split(" ").toList), tags.split(" ").toList)
      play.Logger.info("count = " + size)
      Ok(Extraction.decompose(SearchCount(size))).as("application/json")
  }

}