package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._

class AttachmentSpec extends Specification {
  val a = Attachment.syntax("a")

  "Attachment" should {
    "find by primary keys" in new AutoRollback {
      val maybeFound = Attachment.find(1L)
      maybeFound.isDefined should beTrue
    }
    "find all records" in new AutoRollback {
      val allResults = Attachment.findAll()
      allResults.size should be_>(0)
    }
    "count all records" in new AutoRollback {
      val count = Attachment.countAll()
      count should be_>(0L)
    }
    "find by where clauses" in new AutoRollback {
      val results = Attachment.findAllBy(sqls.eq(a.attachmentId, 1L))
      results.size should be_>(0)
    }
    "count by where clauses" in new AutoRollback {
      val count = Attachment.countBy(sqls.eq(a.attachmentId, 1L))
      count should be_>(0L)
    }
    "create new record" in new AutoRollback {
      val created = Attachment.create(attachmentId = 1L, data = Array[Byte](), fileName = "MyString", contentType = "MyString", fileSize = Some(100), itemId = 1L)
      created should not beNull
    }
    "save a record" in new AutoRollback {
      val entity = Attachment.findAll().head
      val updated = Attachment.save(entity)
      updated should not equalTo(entity)
    }
    "destroy a record" in new AutoRollback {
      val entity = Attachment.findAll().head
      Attachment.destroy(entity)
      val shouldBeNone = Attachment.find(1L)
      shouldBeNone.isDefined should beFalse
    }
  }

}
        