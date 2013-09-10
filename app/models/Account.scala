package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.{DateTime}

case class Account(
  id: Long, 
  name: String, 
  created: DateTime, 
  deleted: Option[DateTime] = None) {

  def save()(implicit session: DBSession = Account.autoSession): Account = Account.save(this)(session)

  def destroy()(implicit session: DBSession = Account.autoSession): Unit = Account.destroy(this)(session)

}
      

object Account extends SQLSyntaxSupport[Account] {

  override val tableName = "accounts"

  override val columns = Seq("id", "name", "created", "deleted")

  def apply(a: ResultName[Account])(rs: WrappedResultSet): Account = new Account(
    id = rs.long(a.id),
    name = rs.string(a.name),
    created = rs.timestamp(a.created).toDateTime,
    deleted = rs.timestampOpt(a.deleted).map(_.toDateTime)
  )
      
  val a = Account.syntax("a")

  val autoSession = AutoSession

  def find(id: Long)(implicit session: DBSession = autoSession): Option[Account] = {
    withSQL { 
      select.from(Account as a).where.eq(a.id, id)
    }.map(Account(a.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[Account] = {
    withSQL(select.from(Account as a)).map(Account(a.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Account as a)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Account] = {
    withSQL { 
      select.from(Account as a).where.append(sqls"${where}")
    }.map(Account(a.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(Account as a).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    name: String,
    created: DateTime,
    deleted: Option[DateTime] = None)(implicit session: DBSession = autoSession): Account = {
    val generatedKey = withSQL {
      insert.into(Account).columns(
        column.name,
        column.created,
        column.deleted
      ).values(
        name,
        created,
        deleted
      )
    }.updateAndReturnGeneratedKey.apply()

    Account(
      id = generatedKey, 
      name = name,
      created = created,
      deleted = deleted)
  }

  def save(entity: Account)(implicit session: DBSession = autoSession): Account = {
    withSQL { 
      update(Account as a).set(
        a.id -> entity.id,
        a.name -> entity.name,
        a.created -> entity.created,
        a.deleted -> entity.deleted
      ).where.eq(a.id, entity.id)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: Account)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(Account).where.eq(column.id, entity.id) }.update.apply()
  }
        
}
