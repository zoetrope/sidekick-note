package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.{DateTime}
import scala.collection.mutable

class Item
(
  val itemId: Long,
  var content: String,
  var words: String,
  var rate: Int = 0,
  var tags: mutable.MutableList[Tag] = new mutable.MutableList,
  val createdAt: DateTime,
  var modifiedAt: DateTime,
  var deletedAt: Option[DateTime] = None,
  val accountId: Long) {

  def save()(implicit session: DBSession = Item.autoSession): Item = Item.save(this)(session)

  def destroy()(implicit session: DBSession = Item.autoSession): Unit = Item.destroy(this)(session)

  def addTag(tagName: String): Unit = {
    val tag = Tag.getOrCreate(tagName)
    ItemTag.addTag(itemId, tag)
    tags += tag
  }

  def deleteTag(tagName: String): Unit = {

  }

  override def equals(obj: Any): Boolean = {
    if (!obj.isInstanceOf[Item]) false

    val t = obj.asInstanceOf[Item]

    this.itemId == t.itemId
  }

  override def hashCode(): Int = (itemId % Int.MaxValue).asInstanceOf[Int]
}

object Item extends SQLSyntaxSupport[Item] {

  override val tableName = "items"

  override val columns = Seq("item_id", "content", "words", "rate", "created_at", "modified_at", "deleted_at", "account_id")

  def apply(i: SyntaxProvider[Item])(implicit rs: WrappedResultSet): Item = apply(i.resultName)(rs)

  def apply(i: ResultName[Item])(implicit rs: WrappedResultSet): Item = new Item(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rate = rs.int(i.rate),
    createdAt = rs.timestamp(i.createdAt).toDateTime,
    modifiedAt = rs.timestamp(i.modifiedAt).toDateTime,
    deletedAt = rs.timestampOpt(i.deletedAt).map(_.toDateTime),
    accountId = rs.long(i.accountId)
  )

  val i = Item.syntax("i")
  val autoSession = AutoSession

  private val (t, it) = (Tag.tg, ItemTag.it)

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[Item] = {
    withSQL[Item] {
      select.from(Item as i)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as t).on(it.tagId, t.tagId)
        .where.eq(i.itemId, itemId)
    }.one(implicit rs => Item(i))
      .toMany(Tag.opt(t))
      .map {
      (item: Item, tags: Seq[Tag]) => {
        item.tags ++= tags
        item
      }
    }.single.apply()
  }

  def findAll()(implicit session: DBSession = autoSession): List[Item] = {
    withSQL[Item] {
      select.from(Item as i)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as t).on(it.tagId, t.tagId)
    }.one(implicit rs => Item(i))
      .toMany(Tag.opt(t))
      .map {
      (item: Item, tags: Seq[Tag]) => {
        item.tags ++= tags
        item
      }
    }.list.apply()
  }

  def findByAccountId(accountId: Long, offset: Int, limit: Int)(implicit session: DBSession = autoSession): List[Item] = {
    withSQL(
      select
        .from(Item as i)
        .where.eq(i.accountId, accountId)
        .orderBy(i.createdAt).desc
        .limit(limit).offset(offset)
    ).map(implicit rs => Item(i)).list.apply()
  }

  def findByKeywords(keywords: String, account_id: Long, offset: Int, limit: Int)(implicit session: DBSession = autoSession): List[Item] = {
    sql"""
      select ${i.result.*}
        from ${Item.as(i)}
        where match words against (${keywords})
    """
      .map(implicit rs => Item(i)).list.apply()
  }

  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Item as i)).map(rs => rs.long(1)).single.apply().get
  }

  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Item] = {
    withSQL {
      select.from(Item as i).where.append(sqls"${where}")
    }.map(implicit rs => Item(i.resultName)).list.apply()
  }

  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL {
      select(sqls"count(1)").from(Item as i).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }

  def create
  (
    content: String,
    words: String,
    rate: Int = 0,
    createdAt: DateTime,
    modifiedAt: DateTime,
    deletedAt: Option[DateTime] = None,
    accountId: Long)(implicit session: DBSession = autoSession): Item = {
    val generatedKey = withSQL {
      insert.into(Item).columns(
        column.content,
        column.words,
        column.rate,
        column.createdAt,
        column.modifiedAt,
        column.deletedAt,
        column.accountId
      ).values(
        content,
        words,
        rate,
        createdAt,
        modifiedAt,
        deletedAt,
        accountId
      )
    }.updateAndReturnGeneratedKey.apply()

    new Item(
      itemId = generatedKey,
      content = content,
      words = words,
      rate = rate,
      createdAt = createdAt,
      modifiedAt = modifiedAt,
      deletedAt = deletedAt,
      accountId = accountId)
  }

  def save(entity: Item)(implicit session: DBSession = autoSession): Item = {
    withSQL {
      update(Item as i).set(
        i.content -> entity.content,
        i.words -> entity.words,
        i.rate -> entity.rate,
        i.modifiedAt -> entity.modifiedAt,
        i.deletedAt -> entity.deletedAt
      ).where.eq(i.itemId, entity.itemId)
    }.update.apply()
    entity
  }

  def destroy(entity: Item)(implicit session: DBSession = autoSession): Unit = {
    withSQL {
      delete.from(Item).where.eq(column.itemId, entity.itemId)
    }.update.apply()
  }

}
