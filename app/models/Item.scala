package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.{DateTime}

class Item
(
  val itemId: Long,
  var content: String,
  var words: String,
  var rate: Int = 0,
  var tags: Seq[Tag] = Nil,
  val created: DateTime,
  var modified: DateTime,
  var deleted: Option[DateTime] = None,
  val accountId: Long) {

  def save()(implicit session: DBSession = Item.autoSession): Item = Item.save(this)(session)

  def destroy()(implicit session: DBSession = Item.autoSession): Unit = Item.destroy(this)(session)


  override def equals(obj: Any): Boolean = {
    if (!obj.isInstanceOf[Item]) false

    val t = obj.asInstanceOf[Item]

    this.itemId == t.itemId
  }

  override def hashCode(): Int = (itemId % Int.MaxValue).asInstanceOf[Int]
}

object Item extends SQLSyntaxSupport[Item] {

  override val tableName = "items"

  override val columns = Seq("item_id", "content", "words", "rate", "created", "modified", "deleted", "account_id")

  def apply(i: SyntaxProvider[Item])(implicit rs: WrappedResultSet): Item = apply(i.resultName)(rs)

  def apply(i: ResultName[Item])(implicit rs: WrappedResultSet): Item = new Item(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rate = rs.int(i.rate),
    created = rs.timestamp(i.created).toDateTime,
    modified = rs.timestamp(i.modified).toDateTime,
    deleted = rs.timestampOpt(i.deleted).map(_.toDateTime),
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
        item.tags = tags;
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
        item.tags = tags;
        item
      }
    }.list.apply()
  }

  def findByAccountId(accountId: Long, offset: Int, limit: Int)(implicit session: DBSession = autoSession): List[Item] = {
    withSQL(
      select
        .from(Item as i)
        .where.eq(i.accountId, accountId)
        .orderBy(i.created).desc
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
    created: DateTime,
    modified: DateTime,
    deleted: Option[DateTime] = None,
    accountId: Long)(implicit session: DBSession = autoSession): Item = {
    val generatedKey = withSQL {
      insert.into(Item).columns(
        column.content,
        column.words,
        column.rate,
        column.created,
        column.modified,
        column.deleted,
        column.accountId
      ).values(
        content,
        words,
        rate,
        created,
        modified,
        deleted,
        accountId
      )
    }.updateAndReturnGeneratedKey.apply()

    new Item(
      itemId = generatedKey,
      content = content,
      words = words,
      rate = rate,
      created = created,
      modified = modified,
      deleted = deleted,
      accountId = accountId)
  }

  def save(entity: Item)(implicit session: DBSession = autoSession): Item = {
    withSQL {
      update(Item as i).set(
        i.content -> entity.content,
        i.words -> entity.words,
        i.rate -> entity.rate,
        i.modified -> entity.modified,
        i.deleted -> entity.deleted
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
