package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._

case class QuickNote(
  itemId: Long) {

  def save()(implicit session: DBSession = QuickNote.autoSession): QuickNote = QuickNote.save(this)(session)

  def destroy()(implicit session: DBSession = QuickNote.autoSession): Unit = QuickNote.destroy(this)(session)

}
      

object QuickNote extends SQLSyntaxSupport[QuickNote] {

  override val tableName = "quick_notes"

  override val columns = Seq("item_id")

  def apply(qn: ResultName[QuickNote])(rs: WrappedResultSet): QuickNote = new QuickNote(
    itemId = rs.long(qn.itemId)
  )
      
  val qn = QuickNote.syntax("qn")

  val autoSession = AutoSession

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[QuickNote] = {
    withSQL { 
      select.from(QuickNote as qn).where.eq(qn.itemId, itemId)
    }.map(QuickNote(qn.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[QuickNote] = {
    withSQL(select.from(QuickNote as qn)).map(QuickNote(qn.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(QuickNote as qn)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[QuickNote] = {
    withSQL { 
      select.from(QuickNote as qn).where.append(sqls"${where}")
    }.map(QuickNote(qn.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(QuickNote as qn).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    itemId: Long)(implicit session: DBSession = autoSession): QuickNote = {
    withSQL {
      insert.into(QuickNote).columns(
        column.itemId
      ).values(
        itemId
      )
    }.update.apply()

    QuickNote(
      itemId = itemId)
  }

  def save(entity: QuickNote)(implicit session: DBSession = autoSession): QuickNote = {
    withSQL { 
      update(QuickNote as qn).set(
        qn.itemId -> entity.itemId
      ).where.eq(qn.itemId, entity.itemId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: QuickNote)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(QuickNote).where.eq(column.itemId, entity.itemId) }.update.apply()
  }
        
}
