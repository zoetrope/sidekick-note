package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class QuickNoteSpec extends Specification {
  val qn = QuickNote.syntax("qn")

  "QuickNote" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = QuickNote.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = QuickNote.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = QuickNote.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = QuickNote.findAllBy(sqls.eq(qn.itemId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = QuickNote.countBy(sqls.eq(qn.itemId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = QuickNote.create(itemId = 1L)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = QuickNote.findAll().head
      val updated = QuickNote.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = QuickNote.findAll().head
      QuickNote.destroy(entity)
      val shouldBeNone = QuickNote.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        