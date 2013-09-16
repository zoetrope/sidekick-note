package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.{DateTime}

case class Item(
  id: Long, 
  content: String, 
  created: DateTime, 
  modified: DateTime, 
  deleted: Option[DateTime] = None, 
  accountId: Long) {

  def save()(implicit session: DBSession = Item.autoSession): Item = Item.save(this)(session)

  def destroy()(implicit session: DBSession = Item.autoSession): Unit = Item.destroy(this)(session)

}
      

object Item extends SQLSyntaxSupport[Item] {

  override val tableName = "items"

  override val columns = Seq("id", "content", "created", "modified", "deleted", "account_id")

  def apply(i: ResultName[Item])(rs: WrappedResultSet): Item = new Item(
    id = rs.long(i.id),
    content = rs.string(i.content),
    created = rs.timestamp(i.created).toDateTime,
    modified = rs.timestamp(i.modified).toDateTime,
    deleted = rs.timestampOpt(i.deleted).map(_.toDateTime),
    accountId = rs.long(i.accountId)
  )
      
  val i = Item.syntax("i")

  val autoSession = AutoSession

  def find(id: Long)(implicit session: DBSession = autoSession): Option[Item] = {
    withSQL { 
      select.from(Item as i).where.eq(i.id, id)
    }.map(Item(i.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[Item] = {
    withSQL(select.from(Item as i)).map(Item(i.resultName)).list.apply()
  }

  def findByAccountId(account_id:Long, offset:Int, limit:Int)(implicit session: DBSession = autoSession): List[Item] = {
    withSQL(
      select.from(Item as i)
        .where.eq(i.accountId, account_id)
        .orderBy(i.created).desc
        .limit(limit).offset(offset)
    ).map(Item(i.resultName)).list.apply()
  }

  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Item as i)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Item] = {
    withSQL { 
      select.from(Item as i).where.append(sqls"${where}")
    }.map(Item(i.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(Item as i).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    content: String,
    created: DateTime,
    modified: DateTime,
    deleted: Option[DateTime] = None,
    accountId: Long)(implicit session: DBSession = autoSession): Item = {
    val generatedKey = withSQL {
      insert.into(Item).columns(
        column.content,
        column.created,
        column.modified,
        column.deleted,
        column.accountId
      ).values(
        content,
        created,
        modified,
        deleted,
        accountId
      )
    }.updateAndReturnGeneratedKey.apply()

    Item(
      id = generatedKey, 
      content = content,
      created = created,
      modified = modified,
      deleted = deleted,
      accountId = accountId)
  }

  def save(entity: Item)(implicit session: DBSession = autoSession): Item = {
    withSQL { 
      update(Item as i).set(
        i.id -> entity.id,
        i.content -> entity.content,
        i.created -> entity.created,
        i.modified -> entity.modified,
        i.deleted -> entity.deleted,
        i.accountId -> entity.accountId
      ).where.eq(i.id, entity.id)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: Item)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(Item).where.eq(column.id, entity.id) }.update.apply()
  }
        
}
