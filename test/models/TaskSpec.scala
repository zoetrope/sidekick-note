package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class TaskSpec extends Specification {
  val t = Task.syntax("t")

  "Task" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = Task.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = Task.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = Task.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = Task.findAllBy(sqls.eq(t.itemId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = Task.countBy(sqls.eq(t.itemId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = Task.create(itemId = 1L, status = "MyString")
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = Task.findAll().head
      val updated = Task.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = Task.findAll().head
      Task.destroy(entity)
      val shouldBeNone = Task.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        