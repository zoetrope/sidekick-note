package article

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import scala.collection.mutable
import org.joda.time.DateTime
import tag.{ItemTag, Tag}
import item.Item

class Article
(
  itemId: Long,
  content: String,
  words: String,
  rate: Int = 0,
  tags: mutable.ArrayBuffer[Tag] = new mutable.ArrayBuffer,
  createdAt: DateTime,
  modifiedAt: DateTime,
  deletedAt: Option[DateTime] = None,
  accountId: Long,
  var title: String) extends Item(itemId, content, words, rate, tags, createdAt, modifiedAt, deletedAt, accountId) {

  override def save()(implicit session: DBSession = Article.autoSession): Article = {
    super.save()
    Article.save(this)(session)
  }

  override def destroy()(implicit session: DBSession = Article.autoSession): Unit = {
    Article.destroy(this)(session)
    super.destroy()
  }

  override def equals(obj: Any): Boolean = {
    if (!obj.isInstanceOf[Article]) false

    val t = obj.asInstanceOf[Article]

    this.itemId == t.itemId
  }

}

case class IdAndTitle(id:Long, title:String)

object Article extends SQLSyntaxSupport[Article] {

  override val tableName = "articles"

  override val columns = Seq("item_id", "title")

  def apply(i: SyntaxProvider[Item], a: SyntaxProvider[Article])(implicit rs: WrappedResultSet): Article = apply(i.resultName, a.resultName)(rs)

  def apply(i: ResultName[Item], a: ResultName[Article])(implicit rs: WrappedResultSet): Article = new Article(
    itemId = rs.long(i.itemId),
    content = rs.string(i.content),
    words = rs.string(i.words),
    rate = rs.int(i.rate),
    createdAt = rs.timestamp(i.createdAt).toDateTime,
    modifiedAt = rs.timestamp(i.modifiedAt).toDateTime,
    deletedAt = rs.timestampOpt(i.deletedAt).map(_.toDateTime),
    accountId = rs.long(i.accountId),
    title = rs.string(a.title)
  )

  val a = Article.syntax("a")
  private val (i, it, tg) = (Item.i, ItemTag.it, Tag.tg)

  val autoSession = AutoSession

  def find(itemId: Long)(implicit session: DBSession = autoSession): Option[Article] = {
    withSQL[Article] {
      select.from(Item as i)
        .join(Article as a).on(a.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(a.itemId, itemId)
    }.one(implicit rs => Article(i, a))
      .toMany(Tag.opt(tg))
      .map((article, tags) => {
      article.tags ++= tags; article
    }).single.apply()
  }

  def findByAccountId(accountId: Long, offset: Int, limit: Int)(implicit session: DBSession = autoSession): List[Article] = {
    withSQL[Article](
      select.from(Item as i)
        .join(Article as a).on(a.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(i.accountId, accountId)
        .orderBy(i.createdAt).desc
        .limit(limit).offset(offset)
    ).one(implicit rs => Article(i, a))
      .toMany(Tag.opt(tg))
      .map((article, tags) => {
      article.tags ++= tags; article
    }).list.apply()
  }

  def findAll()(implicit session: DBSession = autoSession): List[Article] = {
    withSQL[Article](
      select.from(Item as i)
        .join(Article as a).on(a.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
    ).one(implicit rs => Article(i, a))
      .toMany(Tag.opt(tg))
      .map((article, tags) => {
      article.tags ++= tags; article
    }).list.apply()
  }

  def findByTags(accountId: Long, offset: Int, limit: Int, tags: List[String])(implicit session: DBSession = autoSession): List[Article] = {
    withSQL[Article](
      select.from(Item as i)
        .join(Article as a).on(a.itemId, i.itemId)
        .leftJoin(ItemTag as it).on(it.itemId, i.itemId)
        .leftJoin(Tag as tg).on(it.tagId, tg.tagId)
        .where.eq(i.accountId, accountId)
        .and.in(tg.name, tags)
        .orderBy(i.createdAt).desc
        .limit(limit).offset(offset)
    ).one(implicit rs => Article(i, a))
      .toMany(Tag.opt(tg))
      .map((article, tags) => {
      article.tags ++= tags; article
    }).list.apply()
  }

  def getAllTitles(accountId: Long)(implicit session: DBSession = autoSession): List[IdAndTitle] = {
    withSQL[Article] {
      select(sqls"${i.itemId} as id", sqls"${a.title} as title")
        .from(Item as i)
        .join(Article as a).on(a.itemId, i.itemId)
        .where.eq(i.accountId, accountId)
    }.map(implicit rs => IdAndTitle(rs.long("id"),rs.string("title")))
    .list.apply()
  }

  def create
  (
    content: String,
    words: String,
    rate: Int = 0,
    createdAt: DateTime,
    modifiedAt: DateTime,
    deletedAt: Option[DateTime] = None,
    accountId: Long,
    title: String)(implicit session: DBSession = autoSession): Article = {

    val item = Item.create(content, words, rate, createdAt, modifiedAt, deletedAt, accountId)
    withSQL {
      insert.into(Article).columns(
        column.itemId,
        column.title
      ).values(
        item.itemId,
        title
      )
    }.update().apply()

    new Article(
      itemId = item.itemId,
      content = content,
      words = words,
      rate = rate,
      createdAt = createdAt,
      modifiedAt = modifiedAt,
      deletedAt = deletedAt,
      accountId = accountId,
      title = title)
  }

  def save(entity: Article)(implicit session: DBSession = autoSession): Article = {
    withSQL {
      update(Article as a).set(
        a.title -> entity.title
      ).where.eq(a.itemId, entity.itemId)
    }.update.apply()
    entity
  }

  def destroy(entity: Article)(implicit session: DBSession = autoSession): Unit = {
    withSQL {
      delete.from(Article).where.eq(column.itemId, entity.itemId)
    }.update.apply()
  }

}