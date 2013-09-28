package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.DateTime

case class QuickNote(
  itemId: Long,
  content: String,
  words: String,
  rating: Int = 0,
  tags: Seq[Tag] = Nil,
  created: DateTime,
  modified: DateTime,
  deleted: Option[DateTime] = None,
  accountId: Long) {

  def save()(implicit session: DBSession = QuickNote.autoSession): QuickNote = QuickNote.save(this)(session)
  def destroy()(implicit session: DBSession = QuickNote.autoSession): Unit = QuickNote.destroy(this)(session)

  def getParent() : Item = {
    new Item(itemId, content, words, rating, tags, created, modified, deleted, accountId)
  }

  private val column = ItemTag.column

  def addTag(tag: Tag)(implicit session: DBSession = Item.autoSession): Unit = withSQL {
    tag.copy(refCount = tag.refCount + 1)
    tag.save()

    insert.into(ItemTag).namedValues(
      column.itemId -> itemId,
      column.tagId -> tag.tagId)
  }.update.apply()

  def deleteTag(tag: Tag)(implicit session: DBSession = Item.autoSession): Unit = withSQL {
    tag.copy(refCount = tag.refCount - 1)
    tag.save()

    QueryDSL.delete.from(ItemTag)
      .where.eq(column.itemId, itemId).and.eq(column.tagId, tag.tagId)
  }.update.apply()

}

object QuickNote extends SQLSyntaxSupport[QuickNote] {

  override val tableName = "quick_notes"

  override val columns = Seq("item_id")

  def apply(i: SyntaxProvider[Item], qn: SyntaxProvider[QuickNote])(implicit rs: WrappedResultSet): QuickNote = apply(i.resultName, qn.resultName)(rs)
  def apply(i: ResultName[Item], qn: ResultName[QuickNote])(implicit rs: WrappedResultSet): QuickNote = new QuickNote(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rating = rs.int(i.rating),
    created = rs.timestamp(i.created).toDateTime,
    modified = rs.timestamp(i.modified).toDateTime,
    deleted = rs.timestampOpt(i.deleted).map(_.toDateTime),
    accountId = rs.long(i.accountId)
  )

  val qn = QuickNote.syntax("qn")
  val i = Item.i

  val autoSession = AutoSession

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[QuickNote] = {
    withSQL { 
      select.from(QuickNote as qn)
        .join(QuickNote as qn).on(qn.itemId, i.itemId)
        .where.eq(qn.itemId, itemId)
    }.map(implicit rs => QuickNote(i.resultName, qn.resultName)).single.apply()
  }

  def findAll()(implicit session: DBSession = autoSession): List[QuickNote] = {
    withSQL{
      select.from(Item as i)
        .join(QuickNote as qn).on(qn.itemId, i.itemId)
    }
      .map(implicit rs => QuickNote(i, qn))
      .list.apply()
  }
  /*

    def countAll()(implicit session: DBSession = autoSession): Long = {
      withSQL(select(sqls"count(1)").from(QuickNote as qn)).map(rs => rs.long(1)).single.apply().get
    }
    def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[QuickNote] = {
      withSQL {
        select.from(QuickNote as qn).where.append(sqls"${where}")
      }.map(implicit rs => QuickNote(qn.resultName)).list.apply()
    }

    def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
      withSQL {
        select(sqls"count(1)").from(QuickNote as qn).where.append(sqls"${where}")
      }.map(_.long(1)).single.apply().get
    }
    */
  def create(content: String,
             words: String,
             rating: Int = 0,
             created: DateTime,
             modified: DateTime,
             deleted: Option[DateTime] = None,
             accountId: Long)(implicit session: DBSession = autoSession): QuickNote = {

    val item = Item.create(content, words, rating, created, modified, deleted, accountId)
    withSQL {
      insert.into(QuickNote).columns(
        column.itemId
      ).values(
        item.itemId
      )
    }.update().apply()

    QuickNote(
      itemId = item.itemId,
      content = content,
      words = words,
      rating = rating,
      created = created,
      modified = modified,
      deleted = deleted,
      accountId = accountId)
  }

  def save(entity: QuickNote)(implicit session: DBSession = autoSession): QuickNote = {
    val item = entity.getParent()
    item.save()
    withSQL {
      update(QuickNote as qn).set(
        qn.itemId -> entity.itemId
      ).where.eq(qn.itemId, entity.itemId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: QuickNote)(implicit session: DBSession = autoSession): Unit = {
    val item = entity.getParent()
    withSQL {
      delete.from(QuickNote).where.eq(column.itemId, entity.itemId)
    }.update.apply()
    item.destroy()
  }
        
}
