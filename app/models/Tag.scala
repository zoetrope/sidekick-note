package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._

case class Tag(
  tagId: Long, 
  name: String, 
  refCount: Int) {

  def save()(implicit session: DBSession = Tag.autoSession): Tag = Tag.save(this)(session)

  def destroy()(implicit session: DBSession = Tag.autoSession): Unit = Tag.destroy(this)(session)

}
      

object Tag extends SQLSyntaxSupport[Tag] {

  override val tableName = "tags"

  override val columns = Seq("tag_id", "name", "ref_count")

  def apply(t: ResultName[Tag])(rs: WrappedResultSet): Tag = new Tag(
    tagId = rs.long(t.tagId),
    name = rs.string(t.name),
    refCount = rs.int(t.refCount)
  )
      
  val t = Tag.syntax("t")

  val autoSession = AutoSession

  def find(tagId: Long)(implicit session: DBSession = autoSession): Option[Tag] = {
    withSQL { 
      select.from(Tag as t).where.eq(t.tagId, tagId)
    }.map(Tag(t.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[Tag] = {
    withSQL(select.from(Tag as t)).map(Tag(t.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Tag as t)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Tag] = {
    withSQL { 
      select.from(Tag as t).where.append(sqls"${where}")
    }.map(Tag(t.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(Tag as t).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    name: String,
    refCount: Int)(implicit session: DBSession = autoSession): Tag = {
    val generatedKey = withSQL {
      insert.into(Tag).columns(
        column.name,
        column.refCount
      ).values(
        name,
        refCount
      )
    }.updateAndReturnGeneratedKey.apply()

    Tag(
      tagId = generatedKey, 
      name = name,
      refCount = refCount)
  }

  def save(entity: Tag)(implicit session: DBSession = autoSession): Tag = {
    withSQL { 
      update(Tag as t).set(
        t.tagId -> entity.tagId,
        t.name -> entity.name,
        t.refCount -> entity.refCount
      ).where.eq(t.tagId, entity.tagId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: Tag)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(Tag).where.eq(column.tagId, entity.tagId) }.update.apply()
  }
        
}
