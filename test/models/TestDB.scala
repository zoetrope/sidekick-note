package models

import scalikejdbc._
import com.googlecode.flyway.core.Flyway

trait TestDB {

  val dbUrl = "jdbc:mysql://localhost/sidekicknote_test"
  val dbUser = "root"
  val dbPassword = "mysql"

  val flyway = new Flyway
  flyway.setDataSource(dbUrl, dbUser, dbPassword)
  flyway.setLocations("db/migration/default")
  flyway.migrate()

  ConnectionPool.singleton(dbUrl, dbUser, dbPassword)

}