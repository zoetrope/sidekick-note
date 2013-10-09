package models

import scalikejdbc.DBSession

trait ItemModel[T] {
  def find(itemId: Long)(implicit session: DBSession): Option[T]

  def findByAccountId(accountId: Long, offset: Int, limit: Int)(implicit session: DBSession): List[T]

  def findByTags(accountId: Long, offset: Int, limit: Int, tags: List[String])(implicit session: DBSession): List[T]
}
