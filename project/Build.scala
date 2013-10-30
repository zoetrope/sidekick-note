import java.net.InetSocketAddress
import sbt._
import Keys._
import play.Project._
import java.net._

object ApplicationBuild extends Build {

  val appName         = "sidekick-note"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    jdbc,
    "com.github.seratch" %% "scalikejdbc" % "1.6.10",
    "com.github.seratch" %% "scalikejdbc-interpolation" % "1.6.10",
    "com.github.seratch" %% "scalikejdbc-play-plugin" % "1.6.10",
    "com.github.seratch" %% "scalikejdbc-test" % "1.6.10" % "test",
    "mysql" % "mysql-connector-java" % "5.1.26",
    "com.typesafe" %% "play-plugins-redis" % "2.1.1",
    "com.github.tototoshi" %% "play-json4s-native" % "0.2.0",
    "org.json4s" % "json4s-ext_2.10" % "3.2.5",
    "com.github.tototoshi" %% "play-flyway" % "0.2.0",
    "jp.t2v" %% "play2.auth" % "0.10.1" exclude("org.scala-stm", "scala-stm_2.10.0"),
    "org.mindrot" % "jbcrypt" % "0.3m",
    "org.slf4j" % "slf4j-simple" % "1.7.5" % "provided"
  )

  object Keys {
    val uiDirectory = SettingKey[File]("ui-directory")
  }

  import Keys._

  val main = play.Project(appName, appVersion, appDependencies)
    .settings(
    // Add your own project settings here
    resolvers += "org.sedis" at "http://pk11-scratch.googlecode.com/svn/trunk",

    uiDirectory <<= (baseDirectory in Compile) { _ / "ui" },

    playOnStarted <+= uiDirectory { base =>
      (address: InetSocketAddress) => {
        Grunt.process = Some(Process("grunt run", base).run)
      }: Unit
    },

    playOnStopped += {
      () => {
        Grunt.process.map(p => p.destroy())
        Grunt.process = None
      }: Unit
    }
  )

  object Grunt {
    var process: Option[Process] = None
  }
}
