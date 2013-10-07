package models

import scalikejdbc.specs2.mutable.AutoRollback
import org.joda.time._
import scalikejdbc.SQLInterpolation._
import scalikejdbc.DBSession
import org.specs2.mutable.Specification

class AccountSpec extends Specification with TestDB{

  trait AutoRollbackWithFixture extends AutoRollback {
    override def fixture(implicit session: DBSession) {
      applyUpdate {QueryDSL.delete.from(Account)}

      Account.create(
        name = "user",
        password = "pass",
        permission = "NormalUser",
        language = "ja",
        timezone = "Asia/Tokyo",
        createdAt = DateTime.now,
        modifiedAt = DateTime.now)
    }
  }
  "Account" should {
    "find by name" in new AutoRollbackWithFixture {
      val maybeFound = Account.findByName("user")
      maybeFound.isDefined should beTrue
    }
    "create new record" in new AutoRollback {
      val created = Account.create(
        name = "newUser",
        password = "password",
        permission = "NormalUser",
        language = "ja",
        timezone = "Asia/Tokyo",
        createdAt = DateTime.now,
        modifiedAt = DateTime.now)
      created should not beNull
    }
    "authenticate by correct password" in new AutoRollbackWithFixture {
      val maybeFound = Account.authenticate("user","pass")
      maybeFound.isDefined should beTrue
    }
    "authenticate by invalid password" in new AutoRollbackWithFixture {
      val maybeFound = Account.authenticate("user","hoge")
      maybeFound.isDefined should beFalse
    }
    "authenticate by invalid user" in new AutoRollbackWithFixture {
      val maybeFound = Account.authenticate("fuga","pass")
      maybeFound.isDefined should beFalse
    }
  }

}
        