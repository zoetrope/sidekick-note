import models.{NormalUser, Administrator, Account}
import org.joda.time.DateTime
import play.api._

object Global extends GlobalSettings {
  override def onStart(app: Application) {
    if (Account.findAll.isEmpty) {
      Account.create("root", "sidekick", "Administrator", "ja", "Asia/Tokyo", DateTime.now(), DateTime.now(), Option.empty[DateTime])
      Account.create("guest", "guest", "NormalUser", "ja", "Asia/Tokyo", DateTime.now(), DateTime.now(), Option.empty[DateTime])
    }
  }
}