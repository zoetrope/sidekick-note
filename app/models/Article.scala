package models

import scalikejdbc._
import scalikejdbc.SQLInterpolation._

case class Article(
  itemId: Long, 
  title: String) {

  def save()(implicit session: DBSession = Article.autoSession): Article = Article.save(this)(session)

  def destroy()(implicit session: DBSession = Article.autoSession): Unit = Article.destroy(this)(session)

}
      

object Article extends SQLSyntaxSupport[Article] {

  override val tableName = "articles"

  override val columns = Seq("item_id", "title")

  def apply(a: ResultName[Article])(rs: WrappedResultSet): Article = new Article(
    itemId = rs.long(a.itemId),
    title = rs.string(a.title)
  )
      
  val a = Article.syntax("a")

  val autoSession = AutoSession

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[Article] = {
    withSQL { 
      select.from(Article as a).where.eq(a.itemId, itemId)
    }.map(Article(a.resultName)).single.apply()
  }
          
  def findAll()(implicit session: DBSession = autoSession): List[Article] = {
    withSQL(select.from(Article as a)).map(Article(a.resultName)).list.apply()
  }
          
  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Article as a)).map(rs => rs.long(1)).single.apply().get
  }
          
  def findAllBy(where: SQLSyntax)(implicit session: DBSession = autoSession): List[Article] = {
    withSQL { 
      select.from(Article as a).where.append(sqls"${where}")
    }.map(Article(a.resultName)).list.apply()
  }
      
  def countBy(where: SQLSyntax)(implicit session: DBSession = autoSession): Long = {
    withSQL { 
      select(sqls"count(1)").from(Article as a).where.append(sqls"${where}")
    }.map(_.long(1)).single.apply().get
  }
      
  def create(
    itemId: Long,
    title: String)(implicit session: DBSession = autoSession): Article = {
    withSQL {
      insert.into(Article).columns(
        column.itemId,
        column.title
      ).values(
        itemId,
        title
      )
    }.update.apply()

    Article(
      itemId = itemId,
      title = title)
  }

  def save(entity: Article)(implicit session: DBSession = autoSession): Article = {
    withSQL { 
      update(Article as a).set(
        a.itemId -> entity.itemId,
        a.title -> entity.title
      ).where.eq(a.itemId, entity.itemId)
    }.update.apply()
    entity 
  }
        
  def destroy(entity: Article)(implicit session: DBSession = autoSession): Unit = {
    withSQL { delete.from(Article).where.eq(column.itemId, entity.itemId) }.update.apply()
  }
        
}
