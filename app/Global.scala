import models.{NormalUser, Administrator, Account}
import org.joda.time.DateTime
import play.api._

object Global extends GlobalSettings {
  override def onStart(app: Application) {
    if (Account.findAll.isEmpty) {
      Account.create("root", "sidekick", "Administrator", DateTime.now(), Option.empty[DateTime])
      Account.create("guest", "guest", "NormalUser", DateTime.now(), Option.empty[DateTime])
    }
  }
}