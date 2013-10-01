package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.DateTime

sealed trait TaskStatus
case object Completed extends TaskStatus
case object New extends TaskStatus

object TaskStatus {

  def valueOf(value: String): TaskStatus = value match {
    case "Completed" => Completed
    case "New"    => New
    case _ => throw new IllegalArgumentException()
  }

}

case class Task(
  itemId: Long,
  status: TaskStatus,
  dueDate: DateTime) {

  def save()(implicit session: DBSession = Task.autoSession): Task = Task.save(this)(session)

  def destroy()(implicit session: DBSession = Task.autoSession): Unit = Task.destroy(this)(session)

}
      

object Task extends SQLSyntaxSupport[Task] {

  override val tableName = "tasks"

  override val columns = Seq("item_id", "status", "due_date")

  def apply(t: ResultName[Task])(rs: WrappedResultSet): Task = new Task(
    itemId = rs.long(t.itemId),
    status = TaskStatus.valueOf(rs.string(t.status)),
    dueDate = rs.timestamp(t.dueDate).toDateTime
  )
      
  val t = Task.syntax("t")

  val autoSession = AutoSession

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[Task] = {
    withSQL { 
      select.from(Task as t).where.eq(t.itemId, itemId)
    }.map(Task(t.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[Task] = {
    withSQL(select.from(Task as t)).map(Task(t.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Task as t)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Task] = {
    withSQL { 
      select.from(Task as t).where.append(sqls"${where}")
    }.map(Task(t.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(Task as t).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    itemId: Long,
    status: String,
    dueDate: DateTime)(implicit session: DBSession = autoSession): Task = {
    withSQL {
      insert.into(Task).columns(
        column.itemId,
        column.status,
        column.dueDate
      ).values(
        itemId,
        status,
        dueDate
      )
    }.update.apply()

    Task(
      itemId = itemId,
      status = TaskStatus.valueOf(status),
      dueDate = dueDate)
  }

  def save(entity: Task)(implicit session: DBSession = autoSession): Task = {
    withSQL { 
      update(Task as t).set(
        t.itemId -> entity.itemId,
        t.status -> entity.status,
        t.dueDate -> entity.dueDate
      ).where.eq(t.itemId, entity.itemId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: Task)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(Task).where.eq(column.itemId, entity.itemId) }.update.apply()
  }
        
}
