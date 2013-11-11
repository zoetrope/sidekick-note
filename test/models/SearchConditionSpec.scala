package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._
import search_criterion.SearchCriterion

class SearchConditionSpec extends Specification {
  val sc = SearchCriterion.syntax("sc")

  "SearchCriterion" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = SearchCriterion.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = SearchCriterion.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = SearchCriterion.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = SearchCriterion.findAllBy(sqls.eq(sc.conditionId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = SearchCriterion.countBy(sqls.eq(sc.conditionId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = SearchCriterion.create(title = "MyString", targetType = "MyString", accountId = 1L, sortOrder = 123, createdAt = DateTime.now)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = SearchCriterion.findAll().head
      val updated = SearchCriterion.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = SearchCriterion.findAll().head
      SearchCriterion.destroy(entity)
      val shouldBeNone = SearchCriterion.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        