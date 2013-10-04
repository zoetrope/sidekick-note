package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.DateTime

class QuickNote(
                 itemId: Long,
                 content: String,
                 words: String,
                 rate: Int = 0,
                 tags: Seq[Tag] = Nil,
                 created: DateTime,
                 modified: DateTime,
                 deleted: Option[DateTime] = None,
                 accountId: Long) extends Item(itemId, content, words, rate, tags, created, modified, deleted, accountId) {

  override def save()(implicit session: DBSession = QuickNote.autoSession): QuickNote = {
    super.save()
    QuickNote.save(this)(session)
  }

  override def destroy()(implicit session: DBSession = QuickNote.autoSession): Unit = {
    QuickNote.destroy(this)(session)
    super.destroy()
  }

}

object QuickNote extends SQLSyntaxSupport[QuickNote] {

  override val tableName = "quick_notes"

  override val columns = Seq("item_id")

  def apply(i: SyntaxProvider[Item], qn: SyntaxProvider[QuickNote])(implicit rs: WrappedResultSet): QuickNote = apply(i.resultName, qn.resultName)(rs)

  def apply(i: ResultName[Item], qn: ResultName[QuickNote])(implicit rs: WrappedResultSet): QuickNote = new QuickNote(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rate = rs.int(i.rate),
    created = rs.timestamp(i.created).toDateTime,
    modified = rs.timestamp(i.modified).toDateTime,
    deleted = rs.timestampOpt(i.deleted).map(_.toDateTime),
    accountId = rs.long(i.accountId)
  )

  val qn = QuickNote.syntax("qn")
  private val (i, it, tg) = (Item.i, ItemTag.it, Tag.tg)

  val autoSession = AutoSession

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[QuickNote] = {
    withSQL[QuickNote] {
      select.from(Item as i)
        .join(QuickNote as qn).on(qn.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(qn.itemId, itemId)
    }.one(implicit rs => QuickNote(i, qn))
      .toMany(Tag.opt(tg))
      .map((note, tags) => {
      note.tags = tags; note
    }).single.apply()
  }

  def findAll()(implicit session: DBSession = autoSession): List[QuickNote] = {
    withSQL[QuickNote] {
      select.from(Item as i)
        .join(QuickNote as qn).on(qn.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
    }.one(implicit rs => QuickNote(i, qn))
      .toMany(Tag.opt(tg))
      .map((note, tags) => {
      note.tags = tags; note
    }).list.apply()
  }

  def findByAccountId(accountId: Long, offset: Int, limit: Int)(implicit session: DBSession = autoSession): List[QuickNote] = {
    withSQL[QuickNote](
      select.from(Item as i)
        .join(QuickNote as qn).on(qn.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(i.accountId, accountId)
        .orderBy(i.created).desc
        .limit(limit).offset(offset)
    ).one(implicit rs => QuickNote(i, qn))
      .toMany(Tag.opt(tg))
      .map((note, tags) => {
      note.tags = tags; note
    }).list.apply()
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
  def create
  (
    content: String,
    words: String,
    rate: Int = 0,
    created: DateTime,
    modified: DateTime,
    deleted: Option[DateTime] = None,
    accountId: Long)(implicit session: DBSession = autoSession): QuickNote = {

    val item = Item.create(content, words, rate, created, modified, deleted, accountId)
    withSQL {
      insert.into(QuickNote).columns(
        column.itemId
      ).values(
        item.itemId
      )
    }.update().apply()

    new QuickNote(
      itemId = item.itemId,
      content = content,
      words = words,
      rate = rate,
      created = created,
      modified = modified,
      deleted = deleted,
      accountId = accountId)
  }

  def save(entity: QuickNote)(implicit session: DBSession = autoSession): QuickNote = {
    entity
  }

  def destroy(entity: QuickNote)(implicit session: DBSession = autoSession): Unit = {
    withSQL {
      delete.from(QuickNote).where.eq(column.itemId, entity.itemId)
    }.update.apply()
  }

}
