import sbt._
import Keys._
import play.Project._
import scala.sys.process._

object ApplicationBuild extends Build {

  val appName         = "sidekick-note"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    jdbc,
    "com.github.seratch" %% "scalikejdbc" % "[1.6,)",
    "com.github.seratch" %% "scalikejdbc-interpolation" % "[1.6,)",
    "com.github.seratch" %% "scalikejdbc-play-plugin" % "[1.6,)",
    "com.github.seratch" %% "scalikejdbc-config" % "[1.6,)",
    "com.github.seratch" %% "scalikejdbc-test" % "[1.6,)"  % "test",
    "com.github.seratch" %% "scalikejdbc-play-fixture-plugin" % "[1.6,)",
    "mysql" % "mysql-connector-java" % "5.1.26",
    "com.typesafe" %% "play-plugins-redis" % "2.1-09092012-2",
    "com.github.tototoshi" %% "play-json4s-native" % "0.1.0",
    "org.json4s" % "json4s-ext_2.10" % "3.1.0",
    "com.github.tototoshi" %% "play-flyway" % "0.2.0",
    "jp.t2v" %% "play2.auth" % "0.10.1",
    "org.mindrot" % "jbcrypt" % "0.3m"
  )


  val main = play.Project(appName, appVersion, appDependencies)
    .settings(
    // Add your own project settings here
    resolvers += "org.sedis" at "http://pk11-scratch.googlecode.com/svn/trunk"
  )

}
