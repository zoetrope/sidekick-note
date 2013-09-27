package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class TagSpec extends Specification with TestDB {
  val tag = Tag.syntax("t")

  "Tag" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = Tag.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = Tag.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = Tag.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = Tag.findAllBy(sqls.eq(tag.tagId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = Tag.countBy(sqls.eq(tag.tagId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = Tag.create(name = "MyString", refCount = 123)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = Tag.findAll().head
      val updated = Tag.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = Tag.findAll().head
      Tag.destroy(entity)
      val shouldBeNone = Tag.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        