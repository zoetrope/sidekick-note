package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._

case class ItemTag(
  itemId: Long, 
  tagId: Long) {

  def save()(implicit session: DBSession = ItemTag.autoSession): ItemTag = ItemTag.save(this)(session)

  def destroy()(implicit session: DBSession = ItemTag.autoSession): Unit = ItemTag.destroy(this)(session)

}
      

object ItemTag extends SQLSyntaxSupport[ItemTag] {

  override val tableName = "items_tags"

  override val columns = Seq("item_id", "tag_id")

  def apply(it: ResultName[ItemTag])(rs: WrappedResultSet): ItemTag = new ItemTag(
    itemId = rs.long(it.itemId),
    tagId = rs.long(it.tagId)
  )
      
  val it = ItemTag.syntax("it")

  val autoSession = AutoSession

  def find(itemId: Long, tagId: Long)(implicit session: DBSession = autoSession): Option[ItemTag] = {
    withSQL { 
      select.from(ItemTag as it).where.eq(it.itemId, itemId).and.eq(it.tagId, tagId)
    }.map(ItemTag(it.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[ItemTag] = {
    withSQL(select.from(ItemTag as it)).map(ItemTag(it.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(ItemTag as it)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[ItemTag] = {
    withSQL { 
      select.from(ItemTag as it).where.append(sqls"${where}")
    }.map(ItemTag(it.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(ItemTag as it).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    itemId: Long,
    tagId: Long)(implicit session: DBSession = autoSession): ItemTag = {
    withSQL {
      insert.into(ItemTag).columns(
        column.itemId,
        column.tagId
      ).values(
        itemId,
        tagId
      )
    }.update.apply()

    ItemTag(
      itemId = itemId,
      tagId = tagId)
  }

  def save(entity: ItemTag)(implicit session: DBSession = autoSession): ItemTag = {
    withSQL { 
      update(ItemTag as it).set(
        it.itemId -> entity.itemId,
        it.tagId -> entity.tagId
      ).where.eq(it.itemId, entity.itemId).and.eq(it.tagId, entity.tagId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: ItemTag)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(ItemTag).where.eq(column.itemId, entity.itemId).and.eq(column.tagId, entity.tagId) }.update.apply()
  }
        
}
