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
      
  val tg = Tag.syntax("tg")

  def opt(s: SyntaxProvider[Tag])(rs: WrappedResultSet): Option[Tag] = rs.longOpt(tg.resultName.tagId).map(_ => apply(tg.resultName)(rs))

  val autoSession = AutoSession

  def find(tagId: Long)(implicit session: DBSession = autoSession): Option[Tag] = {
    withSQL { 
      select.from(Tag as tg).where.eq(tg.tagId, tagId)
    }.map(Tag(tg.resultName)).single.apply()
  }


  def getOrCreate(tagName: String)(implicit session: DBSession = autoSession): Tag = {

    val tag = withSQL {
      select.from(Tag as tg).where.eq(tg.name, tagName)
    }.map(Tag(tg.resultName)).single.apply()

    tag match{
      case Some(t) => t
      case None => Tag.create(tagName, 0)
    }
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[Tag] = {
    withSQL(
      select.from(Tag as tg)
        .orderBy(tg.refCount).desc
    ).map(Tag(tg.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Tag as tg)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Tag] = {
    withSQL { 
      select.from(Tag as tg).where.append(sqls"${where}")
    }.map(Tag(tg.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(Tag as tg).where.append(sqls"${where}")
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
      update(Tag as tg).set(
        tg.tagId -> entity.tagId,
        tg.name -> entity.name,
        tg.refCount -> entity.refCount
      ).where.eq(tg.tagId, entity.tagId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: Tag)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(Tag).where.eq(column.tagId, entity.tagId) }.update.apply()
  }
        
}
