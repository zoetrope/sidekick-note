package comment

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import scala.collection.mutable
import org.joda.time.DateTime
import tag.{ItemTag, Tag}
import item.Item

class Comment
(
  itemId: Long,
  content: String,
  words: String,
  rate: Int = 0,
  tags: mutable.ArrayBuffer[Tag] = new mutable.ArrayBuffer,
  createdAt: DateTime,
  modifiedAt: DateTime,
  deletedAt: Option[DateTime] = None,
  accountId: Long,
  var parentId: Long) extends Item(itemId, content, words, rate, tags, createdAt, modifiedAt, deletedAt, accountId) {

  override def save()(implicit session: DBSession = Comment.autoSession): Comment = {
    super.save()
    Comment.save(this)(session)
  }

  override def destroy()(implicit session: DBSession = Comment.autoSession): Unit = {
    Comment.destroy(this)(session)
    super.destroy()
  }

  override def equals(obj: Any): Boolean = {
    if (!obj.isInstanceOf[Comment]) false

    val t = obj.asInstanceOf[Comment]

    this.itemId == t.itemId
  }

}

object Comment extends SQLSyntaxSupport[Comment] {

  override val tableName = "comments"

  override val columns = Seq("item_id", "parent_id")

  def apply(i: SyntaxProvider[Item], c: SyntaxProvider[Comment])(implicit rs: WrappedResultSet): Comment = apply(i.resultName, c.resultName)(rs)

  def apply(i: ResultName[Item], c: ResultName[Comment])(implicit rs: WrappedResultSet): Comment = new Comment(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rate = rs.int(i.rate),
    createdAt = rs.timestamp(i.createdAt).toDateTime,
    modifiedAt = rs.timestamp(i.modifiedAt).toDateTime,
    deletedAt = rs.timestampOpt(i.deletedAt).map(_.toDateTime),
    accountId = rs.long(i.accountId),
    parentId = rs.long(c.parentId)
  )

  val c = Comment.syntax("c")
  private val (i, it, tg) = (Item.i, ItemTag.it, Tag.tg)

  val autoSession = AutoSession

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[Comment] = {
    withSQL[Comment] {
      select.from(Item as i)
        .join(Comment as c).on(c.itemId, i.itemId)
        .where.eq(c.itemId, itemId)
    }.map(implicit rs => Comment(i, c)).single.apply()
  }

  def findByParentId(accountId: Long, offset: Int, limit: Int, parentId: Long)(implicit session: DBSession = autoSession): List[Comment] = {
    withSQL[Comment](
      select.from(Item as i)
        .join(Comment as c).on(c.itemId, i.itemId)
        .where.eq(i.accountId, accountId)
        .and.eq(c.parentId, parentId)
        .orderBy(i.createdAt).desc
        .limit(limit).offset(offset)
    ).map(implicit rs => Comment(i, c)).list.apply()
  }

  def create
  (
    content: String,
    words: String,
    rate: Int = 0,
    createdAt: DateTime,
    modifiedAt: DateTime,
    deletedAt: Option[DateTime] = None,
    accountId: Long,
    parentId: Long)(implicit session: DBSession = autoSession): Comment = {

    val item = Item.create(content, words, rate, createdAt, modifiedAt, deletedAt, accountId)
    withSQL {
      insert.into(Comment).columns(
        column.itemId,
        column.parentId
      ).values(
        item.itemId,
        parentId
      )
    }.update().apply()

    new Comment(
      itemId = item.itemId,
      content = content,
      words = words,
      rate = rate,
      createdAt = createdAt,
      modifiedAt = modifiedAt,
      deletedAt = deletedAt,
      accountId = accountId,
      parentId = parentId)
  }

  def save(entity: Comment)(implicit session: DBSession = autoSession): Comment = {
    withSQL {
      update(Comment as c).set(
        c.parentId -> entity.parentId
      ).where.eq(c.itemId, entity.itemId)
    }.update.apply()
    entity
  }

  def destroy(entity: Comment)(implicit session: DBSession = autoSession): Unit = {
    withSQL {
      delete.from(Comment).where.eq(column.itemId, entity.itemId)
    }.update.apply()
  }

}