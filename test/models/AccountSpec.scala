package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class AccountSpec extends Specification {
  val a = Account.syntax("a")

  "Account" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = Account.findById(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = Account.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = Account.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = Account.findAllBy(sqls.eq(a.id, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = Account.countBy(sqls.eq(a.id, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = Account.create(name = "MyString", password = "MyString", permission = "MyString", created = DateTime.now)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = Account.findAll().head
      val updated = Account.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = Account.findAll().head
      Account.destroy(entity)
      val shouldBeNone = Account.findById(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        