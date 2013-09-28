package models

import scalikejdbc.SQLInterpolation._

case class ItemTag(itemId: Long, tagId: Long)

object ItemTag extends SQLSyntaxSupport[ItemTag] {
  override val tableName = "items_tags"
  override val columns = Seq("item_id", "tag_id")
  val it = ItemTag.syntax("it")
}
