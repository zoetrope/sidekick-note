package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.{DateTime}


case class SearchCondition(
  conditionId: Long, 
  title: String, 
  targetType: String, 
  keywords: Option[String] = None, 
  tags: Option[String] = None, 
  accountId: Long, 
  sortOrder: Int, 
  createdAt: DateTime, 
  deletedAt: Option[DateTime] = None) {

  def save()(implicit session: DBSession = SearchCondition.autoSession): SearchCondition = SearchCondition.save(this)(session)

  def destroy()(implicit session: DBSession = SearchCondition.autoSession): Unit = SearchCondition.destroy(this)(session)

}
      

object SearchCondition extends SQLSyntaxSupport[SearchCondition] {

  override val tableName = "search_conditions"

  override val columns = Seq("condition_id", "title", "target_type", "keywords", "tags", "account_id", "sort_order", "created_at", "deleted_at")

  def apply(sc: ResultName[SearchCondition])(rs: WrappedResultSet): SearchCondition = new SearchCondition(
    conditionId = rs.long(sc.conditionId),
    title = rs.string(sc.title),
    targetType = rs.string(sc.targetType),
    keywords = rs.stringOpt(sc.keywords),
    tags = rs.stringOpt(sc.tags),
    accountId = rs.long(sc.accountId),
    sortOrder = rs.int(sc.sortOrder),
    createdAt = rs.timestamp(sc.createdAt).toDateTime,
    deletedAt = rs.timestampOpt(sc.deletedAt).map(_.toDateTime)
  )
      
  val sc = SearchCondition.syntax("sc")

  val autoSession = AutoSession

  def find(conditionId: Long)(implicit session: DBSession = autoSession): Option[SearchCondition] = {
    withSQL { 
      select.from(SearchCondition as sc).where.eq(sc.conditionId, conditionId)
    }.map(SearchCondition(sc.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[SearchCondition] = {
    withSQL(select.from(SearchCondition as sc)).map(SearchCondition(sc.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(SearchCondition as sc)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[SearchCondition] = {
    withSQL { 
      select.from(SearchCondition as sc).where.append(sqls"${where}")
    }.map(SearchCondition(sc.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(SearchCondition as sc).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    title: String,
    targetType: String,
    keywords: Option[String] = None,
    tags: Option[String] = None,
    accountId: Long,
    sortOrder: Int,
    createdAt: DateTime,
    deletedAt: Option[DateTime] = None)(implicit session: DBSession = autoSession): SearchCondition = {
    val generatedKey = withSQL {
      insert.into(SearchCondition).columns(
        column.title,
        column.targetType,
        column.keywords,
        column.tags,
        column.accountId,
        column.sortOrder,
        column.createdAt,
        column.deletedAt
      ).values(
        title,
        targetType,
        keywords,
        tags,
        accountId,
        sortOrder,
        createdAt,
        deletedAt
      )
    }.updateAndReturnGeneratedKey.apply()

    SearchCondition(
      conditionId = generatedKey, 
      title = title,
      targetType = targetType,
      keywords = keywords,
      tags = tags,
      accountId = accountId,
      sortOrder = sortOrder,
      createdAt = createdAt,
      deletedAt = deletedAt)
  }

  def save(entity: SearchCondition)(implicit session: DBSession = autoSession): SearchCondition = {
    withSQL { 
      update(SearchCondition as sc).set(
        sc.conditionId -> entity.conditionId,
        sc.title -> entity.title,
        sc.targetType -> entity.targetType,
        sc.keywords -> entity.keywords,
        sc.tags -> entity.tags,
        sc.accountId -> entity.accountId,
        sc.sortOrder -> entity.sortOrder,
        sc.createdAt -> entity.createdAt,
        sc.deletedAt -> entity.deletedAt
      ).where.eq(sc.conditionId, entity.conditionId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: SearchCondition)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(SearchCondition).where.eq(column.conditionId, entity.conditionId) }.update.apply()
  }
        
}
