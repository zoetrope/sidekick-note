package models

import scalikejdbc.DBSession
import scalikejdbc.SQLInterpolation._
import scala.Some
import scalikejdbc.interpolation.SQLSyntax._
import scala.Some

trait ItemQueryHelper {

  def matchTagsQuery(tags: List[String]) : SQLBuilder[_]= {
    val (match_it, search_tg, except_it) = (ItemTag.syntax("match_it"), Tag.syntax("search_tg"), ItemTag.syntax("except_it"))

    select(distinct(match_it.result.itemId))
      .from(ItemTag as match_it)
      .where.notExists(// 差集合が空ならば条件にマッチするということ
      select
        .from(Tag as search_tg)
        .where.in(search_tg.name, tags) // 検索条件に一致するタグの一覧
        .and.notExists(// 検索条件に一致するタグの一覧との差集合を求める
        select
          .from(ItemTag as except_it)
          .where.eq(search_tg.tagId, except_it.tagId)
          .and.eq(except_it.itemId, match_it.itemId)))
  }

  def matchKeywordsQuery(keywords:String) : Option[SQLSyntax] = {
    if (keywords == null || keywords.isEmpty) {
      None
    } else {
      Some(sqls"match words against (${keywords})")
    }
  }
}
