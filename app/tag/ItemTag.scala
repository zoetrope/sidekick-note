package tag

import scalikejdbc.SQLInterpolation._
import scalikejdbc.{AutoSession, DBSession}

case class ItemTag(itemId: Long, tagId: Long)

object ItemTag extends SQLSyntaxSupport[ItemTag] {
  override val tableName = "items_tags"
  override val columns = Seq("item_id", "tag_id")
  val it = ItemTag.syntax("it")

  val autoSession = AutoSession

  def addTag(itemId: Long, tag: Tag)(implicit session: DBSession = autoSession): Unit = withSQL {
    val newTag =tag.copy(refCount = tag.refCount + 1)
    newTag.save()

    insert.into(ItemTag).columns(
      column.itemId,
      column.tagId
    ).values(
      itemId,
      newTag.tagId
    )
  }.update.apply()

  def deleteTag(itemId: Long, tag: Tag)(implicit session: DBSession = autoSession): Unit = withSQL {
    val newTag = tag.copy(refCount = tag.refCount - 1)
    newTag.save()

    delete.from(ItemTag)
      .where.eq(column.itemId, itemId)
      .and.eq(column.tagId, newTag.tagId)
  }.update.apply()
}
