package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class ItemSpec extends Specification {
  val i = Item.syntax("i")

  "Item" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = Item.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = Item.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = Item.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = Item.findAllBy(sqls.eq(i.id, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = Item.countBy(sqls.eq(i.id, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = Item.create(content = "MyString", created = DateTime.now, modified = DateTime.now)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = Item.findAll().head
      val updated = Item.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = Item.findAll().head
      Item.destroy(entity)
      val shouldBeNone = Item.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        