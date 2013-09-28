package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.{DateTime}

case class Item(
                 itemId: Long,
                 content: String,
                 words: String,
                 rating: Int = 0,
                 tags: Seq[Tag] = Nil,
                 created: DateTime,
                 modified: DateTime,
                 deleted: Option[DateTime] = None,
                 accountId: Long) {

  def save()(implicit session: DBSession = Item.autoSession): Item = Item.save(this)(session)

  def destroy()(implicit session: DBSession = Item.autoSession): Unit = Item.destroy(this)(session)

  private val (it, i, t) = (ItemTag.it, Item.i, Tag.t)
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

object Item extends SQLSyntaxSupport[Item] {

  override val tableName = "items"

  override val columns = Seq("item_id", "content", "words", "rating", "created", "modified", "deleted", "account_id")

  def apply(i: SyntaxProvider[Item])(implicit rs: WrappedResultSet): Item = apply(i.resultName)(rs)
  def apply(i: ResultName[Item])(implicit rs: WrappedResultSet): Item = new Item(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rating = rs.int(i.rating),
    created = rs.timestamp(i.created).toDateTime,
    modified = rs.timestamp(i.modified).toDateTime,
    deleted = rs.timestampOpt(i.deleted).map(_.toDateTime),
    accountId = rs.long(i.accountId)
  )

  val i = Item.syntax("i")
  val autoSession = AutoSession

  private val (t, it) = (Tag.t, ItemTag.it)

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[Item] = {
    withSQL {
      select.from(Item as i)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as t).on(it.tagId, t.tagId)
        .where.eq(i.itemId, itemId)
    }.one(implicit rs => Item(i))
      .toMany(Tag.opt(t))
      .map{ (item, tags) => item.copy(tags = tags) }.single.apply()
  }

  def findAll()(implicit session: DBSession = autoSession): List[Item] = {
    withSQL {
      select.from(Item as i)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as t).on(it.tagId, t.tagId)
    }.one(implicit rs => Item(i))
      .toMany(Tag.opt(t))
      .map{ (item, tags) => item.copy(tags = tags) }.list.apply()
  }

  def findByAccountId(accountId:Long, offset:Int, limit:Int)(implicit session: DBSession = autoSession): List[Item] = {
    withSQL(
      select
        .from(Item as i)
        .where.eq(i.accountId, accountId)
        .orderBy(i.created).desc
        .limit(limit).offset(offset)
    ).map(implicit rs => Item(i)).list.apply()
  }

  def findByKeywords(keywords:String, account_id:Long, offset:Int, limit:Int)(implicit session: DBSession = autoSession): List[Item] = {
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

  def create(content: String,
              words: String,
              rating: Int = 0,
              created: DateTime,
              modified: DateTime,
              deleted: Option[DateTime] = None,
              accountId: Long)(implicit session: DBSession = autoSession): Item = {
    val generatedKey = withSQL {
      insert.into(Item).columns(
        column.content,
        column.words,
        column.rating,
        column.created,
        column.modified,
        column.deleted,
        column.accountId
      ).values(
        content,
        words,
        rating,
        created,
        modified,
        deleted,
        accountId
      )
    }.updateAndReturnGeneratedKey.apply()

    Item(
      itemId = generatedKey,
      content = content,
      words = words,
      rating = rating,
      created = created,
      modified = modified,
      deleted = deleted,
      accountId = accountId)
  }

  def save(entity: Item)(implicit session: DBSession = autoSession): Item = {
    withSQL {
      update(Item as i).set(
        i.itemId -> entity.itemId,
        i.content -> entity.content,
        i.words -> entity.words,
        i.rating -> entity.rating,
        i.created -> entity.created,
        i.modified -> entity.modified,
        i.deleted -> entity.deleted,
        i.accountId -> entity.accountId
      ).where.eq(i.itemId, entity.itemId)
    }.update.apply()
    entity
  }

  def destroy(entity: Item)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(Item).where.eq(column.itemId, entity.itemId) }.update.apply()
  }

}
