package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.DateTime


class Task
(
  itemId: Long,
  content: String,
  words: String,
  rate: Int = 0,
  tags: Seq[Tag] = Nil,
  created: DateTime,
  modified: DateTime,
  deleted: Option[DateTime] = None,
  accountId: Long,
  var status: TaskStatus,
  var dueDate: Option[DateTime]) extends Item(itemId, content, words, rate, tags, created, modified, deleted, accountId) {

  override def save()(implicit session: DBSession = Task.autoSession): Task = {
    super.save()
    Task.save(this)(session)
  }

  override def destroy()(implicit session: DBSession = Task.autoSession): Unit = {
    Task.destroy(this)(session)
    super.destroy()
  }

  override def equals(obj: Any): Boolean = {
    if (!obj.isInstanceOf[Task]) false

    val t = obj.asInstanceOf[Task]

    this.itemId == t.itemId
  }

}

object Task extends SQLSyntaxSupport[Task] {

  override val tableName = "tasks"

  override val columns = Seq("item_id", "status", "due_date")

  def apply(i: SyntaxProvider[Item], t: SyntaxProvider[Task])(implicit rs: WrappedResultSet): Task = apply(i.resultName, t.resultName)(rs)

  def apply(i: ResultName[Item], t: ResultName[Task])(implicit rs: WrappedResultSet): Task = new Task(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rate = rs.int(i.rate),
    created = rs.timestamp(i.created).toDateTime,
    modified = rs.timestamp(i.modified).toDateTime,
    deleted = rs.timestampOpt(i.deleted).map(_.toDateTime),
    accountId = rs.long(i.accountId),
    status = TaskStatus.valueOf(rs.string(t.status)),
    dueDate = rs.timestampOpt(t.dueDate).map(_.toDateTime)
  )

  val t = Task.syntax("t")
  private val (i, it, tg) = (Item.i, ItemTag.it, Tag.tg)

  val autoSession = AutoSession

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[Task] = {
    withSQL[Task] {
      select.from(Item as i)
        .join(Task as t).on(t.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(t.itemId, itemId)
    }.one(implicit rs => Task(i, t))
      .toMany(Tag.opt(tg))
      .map((task, tags) => {
      task.tags = tags; task
    }).single.apply()
  }

  def findAll()(implicit session: DBSession = autoSession): List[Task] = {
    withSQL[Task] {
      select.from(Item as i)
        .join(Task as t).on(t.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
    }.one(implicit rs => Task(i, t))
      .toMany(Tag.opt(tg))
      .map((task, tags) => {
      task.tags = tags; task
    }).list.apply()
  }

  def findByAccountId(accountId: Long, offset: Int, limit: Int)(implicit session: DBSession = autoSession): List[Task] = {
    withSQL[Task](
      select.from(Item as i)
        .join(Task as t).on(t.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(i.accountId, accountId)
        .orderBy(i.created).desc
        .limit(limit).offset(offset)
    ).one(implicit rs => Task(i, t))
      .toMany(Tag.opt(tg))
      .map((task, tags) => {
      task.tags = tags; task
    }).list.apply()
  }

  def findByTags(accountId: Long, offset: Int, limit: Int, tags: List[Tag])(implicit session: DBSession = autoSession): List[Task] = {
    withSQL[Task](
      select.from(Item as i)
        .join(Task as t).on(t.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(i.accountId, accountId)
        .and.in(tg.tagId, tags.map(tag => tag.tagId))
        .orderBy(i.created).desc
        .limit(limit).offset(offset)
    ).one(implicit rs => Task(i, t))
      .toMany(Tag.opt(tg))
      .map((task, tags) => {
      task.tags = tags; task
    }).list.apply()
  }

  def create
  (
    content: String,
    words: String,
    rate: Int = 0,
    created: DateTime,
    modified: DateTime,
    deleted: Option[DateTime] = None,
    accountId: Long,
    status: TaskStatus,
    dueDate: Option[DateTime])(implicit session: DBSession = autoSession): Task = {

    val item = Item.create(content, words, rate, created, modified, deleted, accountId)
    withSQL {
      insert.into(Task).columns(
        column.itemId,
        column.status,
        column.dueDate
      ).values(
        item.itemId,
        status.toString,
        dueDate
      )
    }.update().apply()

    new Task(
      itemId = item.itemId,
      content = content,
      words = words,
      rate = rate,
      created = created,
      modified = modified,
      deleted = deleted,
      accountId = accountId,
      status = status,
      dueDate = dueDate)
  }

  def save(entity: Task)(implicit session: DBSession = autoSession): Task = {
    withSQL {
      update(Task as t).set(
        t.status -> entity.status,
        t.dueDate -> entity.dueDate
      ).where.eq(t.itemId, entity.itemId)
    }.update.apply()
    entity
  }

  def destroy(entity: Task)(implicit session: DBSession = autoSession): Unit = {
    withSQL {
      delete.from(Task).where.eq(column.itemId, entity.itemId)
    }.update.apply()
  }

}