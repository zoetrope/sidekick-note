package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._
import comment.Comment

class CommentSpec extends Specification {
  val c = Comment.syntax("c")

  "Comment" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = Comment.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = Comment.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = Comment.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = Comment.findAllBy(sqls.eq(c.itemId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = Comment.countBy(sqls.eq(c.itemId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = Comment.create(itemId = 1L)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = Comment.findAll().head
      val updated = Comment.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = Comment.findAll().head
      Comment.destroy(entity)
      val shouldBeNone = Comment.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        