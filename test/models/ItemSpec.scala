package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.specs2.mutable._
import org.joda.time._
import scalikejdbc.SQLInterpolation._
import scalikejdbc.DBSession

class ItemSpec extends Specification with TestDB {

  trait AutoRollbackWithFixture extends AutoRollback {
    override def fixture(implicit session: DBSession) {
      applyUpdate {QueryDSL.delete.from(ItemTag)}
      applyUpdate {QueryDSL.delete.from(Tag)}
      applyUpdate {QueryDSL.delete.from(Item)}
      applyUpdate {QueryDSL.delete.from(Account)}

      val account = Account.create(
        name = "user",
        password = "pass",
        permission = "NormalUser",
        language = "ja",
        timezone = "Asia/Tokyo",
        created = DateTime.now,
        modified = DateTime.now)

      val item = Item.create(
        content = "MyString",
        words = "MyString",
        created = DateTime.now,
        modified = DateTime.now,
        accountId = account.accountId)

      val tag = Tag.create("tag1", 0)
      ItemTag.addTag(item.itemId, tag)
    }
  }

  "Item" should {

    "find all records" in new AutoRollbackWithFixture {
      val allResults = Item.findAll()
      allResults.size should be_>(0)
      allResults.head.tags.size should be_>(0)
      allResults.head.tags.head.name must equalTo("tag1")
    }
  }

}
        