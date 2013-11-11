import org.joda.time.DateTime
import play.api._
import user.Account

object Global extends GlobalSettings {
  override def onStart(app: Application) {
    if (Account.countAll() == 0) {
      Account.create("root", "sidekick", "Administrator", "ja", "Asia/Tokyo", DateTime.now(), DateTime.now(), Option.empty[DateTime])
      Account.create("guest", "guest", "NormalUser", "ja", "Asia/Tokyo", DateTime.now(), DateTime.now(), Option.empty[DateTime])
    }
  }
}