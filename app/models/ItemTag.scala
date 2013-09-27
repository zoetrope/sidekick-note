package models

import scalikejdbc.SQLInterpolation._

case class ItemTag(itemId: Long, tagId: Long)

object ItemTag extends SQLSyntaxSupport[ItemTag] {
  val it = ItemTag.syntax("it")
}
