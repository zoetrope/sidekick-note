package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class ArticleSpec extends Specification {
  val a = Article.syntax("a")

  "Article" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = Article.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = Article.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = Article.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = Article.findAllBy(sqls.eq(a.itemId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = Article.countBy(sqls.eq(a.itemId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = Article.create(itemId = 1L, title = "MyString")
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = Article.findAll().head
      val updated = Article.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = Article.findAll().head
      Article.destroy(entity)
      val shouldBeNone = Article.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        