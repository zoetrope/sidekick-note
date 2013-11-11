package search_criterion

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.DateTime


case class SearchCriterion(
  criterionId: Long,
  title: String, 
  targetType: String, 
  query: Option[String] = None,
  accountId: Long,
  sortOrder: Int, 
  createdAt: DateTime, 
  deletedAt: Option[DateTime] = None) {

  def save()(implicit session: DBSession = SearchCriterion.autoSession): SearchCriterion = SearchCriterion.save(this)(session)

  def destroy()(implicit session: DBSession = SearchCriterion.autoSession): Unit = SearchCriterion.destroy(this)(session)

}
      

object SearchCriterion extends SQLSyntaxSupport[SearchCriterion] {

  override val tableName = "search_criteria"

  override val columns = Seq("criterion_id", "title", "target_type", "query", "account_id", "sort_order", "created_at", "deleted_at")

  def apply(sc: ResultName[SearchCriterion])(rs: WrappedResultSet): SearchCriterion = new SearchCriterion(
    criterionId = rs.long(sc.criterionId),
    title = rs.string(sc.title),
    targetType = rs.string(sc.targetType),
    query = rs.stringOpt(sc.query),
    accountId = rs.long(sc.accountId),
    sortOrder = rs.int(sc.sortOrder),
    createdAt = rs.timestamp(sc.createdAt).toDateTime,
    deletedAt = rs.timestampOpt(sc.deletedAt).map(_.toDateTime)
  )
      
  val sc = SearchCriterion.syntax("sc")

  val autoSession = AutoSession

  def find(criterionId: Long)(implicit session: DBSession = autoSession): Option[SearchCriterion] = {
    withSQL { 
      select.from(SearchCriterion as sc).where.eq(sc.criterionId, criterionId)
    }.map(SearchCriterion(sc.resultName)).single.apply()
  }
          
  def findAll(accountId: Long, target: String)(implicit session: DBSession = autoSession): List[SearchCriterion] = {
    withSQL(
      select
        .from(SearchCriterion as sc)
        .where.eq(sc.accountId, accountId)
        .and.eq(sc.targetType, target)
    ).map(SearchCriterion(sc.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(SearchCriterion as sc)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[SearchCriterion] = {
    withSQL { 
      select.from(SearchCriterion as sc).where.append(sqls"${where}")
    }.map(SearchCriterion(sc.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(SearchCriterion as sc).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    title: String,
    targetType: String,
    query: Option[String] = None,
    accountId: Long,
    sortOrder: Int,
    createdAt: DateTime,
    deletedAt: Option[DateTime] = None)(implicit session: DBSession = autoSession): SearchCriterion = {
    val generatedKey = withSQL {
      insert.into(SearchCriterion).columns(
        column.title,
        column.targetType,
        column.query,
        column.accountId,
        column.sortOrder,
        column.createdAt,
        column.deletedAt
      ).values(
        title,
        targetType,
        query,
        accountId,
        sortOrder,
        createdAt,
        deletedAt
      )
    }.updateAndReturnGeneratedKey.apply()

    SearchCriterion(
      criterionId = generatedKey,
      title = title,
      targetType = targetType,
      query = query,
      accountId = accountId,
      sortOrder = sortOrder,
      createdAt = createdAt,
      deletedAt = deletedAt)
  }

  def save(entity: SearchCriterion)(implicit session: DBSession = autoSession): SearchCriterion = {
    withSQL { 
      update(SearchCriterion as sc).set(
        sc.criterionId -> entity.criterionId,
        sc.title -> entity.title,
        sc.targetType -> entity.targetType,
        sc.query -> entity.query,
        sc.accountId -> entity.accountId,
        sc.sortOrder -> entity.sortOrder,
        sc.createdAt -> entity.createdAt,
        sc.deletedAt -> entity.deletedAt
      ).where.eq(sc.criterionId, entity.criterionId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: SearchCriterion)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(SearchCriterion).where.eq(column.criterionId, entity.criterionId) }.update.apply()
  }
        
}
