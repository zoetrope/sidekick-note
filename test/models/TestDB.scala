package models

import scalikejdbc._
import com.googlecode.flyway.core.Flyway
import org.slf4j.LoggerFactory


trait TestDB {
  TestDB.initialize()
}

object TestDB {
  private var isInitialized = false

  def initialize(): Unit = this.synchronized {
    if (isInitialized) return

    val dbUrl = "jdbc:mysql://localhost/sidekicknote_test"
    val dbUser = "root"
    val dbPassword = "mysql"

    val flyway = new Flyway
    flyway.setDataSource(dbUrl, dbUser, dbPassword)
    flyway.setLocations("db/migration/default")
    flyway.migrate()

    ConnectionPool.singleton(dbUrl, dbUser, dbPassword)

    isInitialized = true
  }

}