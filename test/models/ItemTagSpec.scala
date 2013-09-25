package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class ItemTagSpec extends Specification {
  val it = ItemTag.syntax("it")

  "ItemTag" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = ItemTag.find(1L, 1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = ItemTag.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = ItemTag.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = ItemTag.findAllBy(sqls.eq(it.itemId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = ItemTag.countBy(sqls.eq(it.itemId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = ItemTag.create(itemId = 1L, tagId = 1L)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = ItemTag.findAll().head
      val updated = ItemTag.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = ItemTag.findAll().head
      ItemTag.destroy(entity)
      val shouldBeNone = ItemTag.find(1L, 1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        