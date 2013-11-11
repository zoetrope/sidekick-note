package attachment

import scalikejdbc._
import scalikejdbc.SQLInterpolation._

case class Attachment(
  attachmentId: Long, 
  data: Array[Byte], 
  fileName: String, 
  description: Option[String] = None, 
  contentType: String,
  fileSize: Option[Int],
  itemId: Long) {

  def save()(implicit session: DBSession = Attachment.autoSession): Attachment = Attachment.save(this)(session)

  def destroy()(implicit session: DBSession = Attachment.autoSession): Unit = Attachment.destroy(this)(session)

}
      

object Attachment extends SQLSyntaxSupport[Attachment] {

  override val tableName = "attachments"

  override val columns = Seq("attachment_id", "data", "file_name", "description", "content_type", "file_size", "item_id")

  def apply(a: ResultName[Attachment])(rs: WrappedResultSet): Attachment = new Attachment(
    attachmentId = rs.long(a.attachmentId),
    data = rs.bytes(a.data),
    fileName = rs.string(a.fileName),
    description = rs.stringOpt(a.description),
    contentType = rs.string(a.contentType),
    fileSize = rs.intOpt(a.fileSize),
    itemId = rs.long(a.itemId)
  )
      
  val a = Attachment.syntax("a")

  val autoSession = AutoSession

  def find(attachmentId: Long)(implicit session: DBSession = autoSession): Option[Attachment] = {
    withSQL { 
      select.from(Attachment as a).where.eq(a.attachmentId, attachmentId)
    }.map(Attachment(a.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[Attachment] = {
    withSQL(select.from(Attachment as a)).map(Attachment(a.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Attachment as a)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Attachment] = {
    withSQL { 
      select.from(Attachment as a).where.append(sqls"${where}")
    }.map(Attachment(a.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(Attachment as a).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    attachmentId: Long,
    data: Array[Byte],
    fileName: String,
    description: Option[String] = None,
    contentType: String,
    fileSize: Option[Int],
    itemId: Long)(implicit session: DBSession = autoSession): Attachment = {
    withSQL {
      insert.into(Attachment).columns(
        column.attachmentId,
        column.data,
        column.fileName,
        column.description,
        column.contentType,
        column.fileSize,
        column.itemId
      ).values(
        attachmentId,
        data,
        fileName,
        description,
        contentType,
        fileSize,
        itemId
      )
    }.update.apply()

    Attachment(
      attachmentId = attachmentId,
      data = data,
      fileName = fileName,
      description = description,
      contentType = contentType,
      fileSize = fileSize,
      itemId = itemId)
  }

  def save(entity: Attachment)(implicit session: DBSession = autoSession): Attachment = {
    withSQL { 
      update(Attachment as a).set(
        a.attachmentId -> entity.attachmentId,
        a.data -> entity.data,
        a.fileName -> entity.fileName,
        a.description -> entity.description,
        a.contentType -> entity.contentType,
        a.fileSize -> entity.fileSize,
        a.itemId -> entity.itemId
      ).where.eq(a.attachmentId, entity.attachmentId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: Attachment)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(Attachment).where.eq(column.attachmentId, entity.attachmentId) }.update.apply()
  }
        
}
