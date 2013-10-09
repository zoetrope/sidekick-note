package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.DateTime
import scala.collection.mutable


class Task
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
  var status: TaskStatus,
  var dueDate: Option[DateTime],
  var completedAt: Option[DateTime]) extends Item(itemId, content, words, rate, tags, createdAt, modifiedAt, deletedAt, accountId) {

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

  override val columns = Seq("item_id", "status", "due_date", "completed_at")

  def apply(i: SyntaxProvider[Item], t: SyntaxProvider[Task])(implicit rs: WrappedResultSet): Task = apply(i.resultName, t.resultName)(rs)

  def apply(i: ResultName[Item], t: ResultName[Task])(implicit rs: WrappedResultSet): Task = new Task(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rate = rs.int(i.rate),
    createdAt = rs.timestamp(i.createdAt).toDateTime,
    modifiedAt = rs.timestamp(i.modifiedAt).toDateTime,
    deletedAt = rs.timestampOpt(i.deletedAt).map(_.toDateTime),
    accountId = rs.long(i.accountId),
    status = TaskStatus.valueOf(rs.string(t.status)),
    dueDate = rs.timestampOpt(t.dueDate).map(_.toDateTime),
    completedAt = rs.timestampOpt(t.completedAt).map(_.toDateTime)
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
      task.tags ++= tags; task
    }).single.apply()
  }

  def findByAccountId(accountId: Long, offset: Int, limit: Int)(implicit session: DBSession = autoSession): List[Task] = {
    withSQL[Task](
      select.from(Item as i)
        .join(Task as t).on(t.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(i.accountId, accountId)
        .orderBy(i.createdAt).desc
        .limit(limit).offset(offset)
    ).one(implicit rs => Task(i, t))
      .toMany(Tag.opt(tg))
      .map((task, tags) => {
      task.tags ++= tags; task
    }).list.apply()
  }

  def findByTags(accountId: Long, offset: Int, limit: Int, tags: List[String])(implicit session: DBSession = autoSession): List[Task] = {
    withSQL[Task](
      select.from(Item as i)
        .join(Task as t).on(t.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(i.accountId, accountId)
        .and.in(tg.name, tags)
        .orderBy(i.createdAt).desc
        .limit(limit).offset(offset)
    ).one(implicit rs => Task(i, t))
      .toMany(Tag.opt(tg))
      .map((task, tags) => {
      task.tags ++= tags; task
    }).list.apply()
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
    status: TaskStatus,
    dueDate: Option[DateTime],
    completedAt: Option[DateTime])(implicit session: DBSession = autoSession): Task = {

    val item = Item.create(content, words, rate, createdAt, modifiedAt, deletedAt, accountId)
    withSQL {
      insert.into(Task).columns(
        column.itemId,
        column.status,
        column.dueDate,
        column.completedAt
      ).values(
        item.itemId,
        status.toString,
        dueDate,
        completedAt
      )
    }.update().apply()

    new Task(
      itemId = item.itemId,
      content = content,
      words = words,
      rate = rate,
      createdAt = createdAt,
      modifiedAt = modifiedAt,
      deletedAt = deletedAt,
      accountId = accountId,
      status = status,
      dueDate = dueDate,
      completedAt = completedAt)
  }

  def save(entity: Task)(implicit session: DBSession = autoSession): Task = {
    withSQL {
      update(Task as t).set(
        t.status -> entity.status.toString,
        t.dueDate -> entity.dueDate,
        t.completedAt -> entity.completedAt
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