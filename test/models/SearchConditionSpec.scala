package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class SearchConditionSpec extends Specification {
  val sc = SearchCondition.syntax("sc")

  "SearchCondition" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = SearchCondition.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = SearchCondition.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = SearchCondition.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = SearchCondition.findAllBy(sqls.eq(sc.conditionId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = SearchCondition.countBy(sqls.eq(sc.conditionId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = SearchCondition.create(title = "MyString", targetType = "MyString", accountId = 1L, sortOrder = 123, createdAt = DateTime.now)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = SearchCondition.findAll().head
      val updated = SearchCondition.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = SearchCondition.findAll().head
      SearchCondition.destroy(entity)
      val shouldBeNone = SearchCondition.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        