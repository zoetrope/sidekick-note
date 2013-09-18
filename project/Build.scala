import sbt._
import Keys._
import play.Project._
import com.github.mumoshu.play2.typescript.TypeScriptPlugin._
import scala.sys.process._
import com.gu.SbtJasminePlugin._

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
    "org.webjars" %% "webjars-play" % "2.1.0-3",
    "org.webjars" % "bootstrap" % "3.0.0",
    "org.webjars" % "jquery" % "1.9.1",
    "org.webjars" % "angularjs" % "1.0.7",
    "org.webjars" % "angular-ui-utils" % "47ff7ef35c",
    "org.webjars" % "marked" % "0.2.9",
    "org.webjars" % "highlightjs" % "7.3-1",
    "com.github.tototoshi" %% "play-json4s-native" % "0.1.0",
    "org.json4s" % "json4s-ext_2.10" % "3.1.0",
    "com.github.tototoshi" %% "play-flyway" % "0.2.0",
    "jp.t2v" %% "play2.auth" % "0.10.1",
    "org.mindrot" % "jbcrypt" % "0.3m"
  )

  object Tasks {

    val tsdTaskKey = TaskKey[Unit]("tsd", "install .d.ts file")

    val tsdTask = tsdTaskKey := {
      scala.sys.process.Process("tsd install jquery angular angular-resource marked", new File("app/assets")) run
    }
    val tsdTestTaskKey = TaskKey[Unit]("tsd-test", "install .d.ts file for test")

    val tsdTestTask = tsdTestTaskKey := {
      scala.sys.process.Process("tsd install jasmine angular-mocks", new File("test/assets")) run
    }
  }

  val main = play.Project(appName, appVersion, appDependencies)
    .settings(jasmineSettings : _*)
    .settings(
    // Add your own project settings here
    tsOptions ++= Seq("--sourcemap"),
    resolvers += "org.sedis" at "http://pk11-scratch.googlecode.com/svn/trunk",
    appJsDir <+= baseDirectory / "app/assets/typescripts",
    appJsLibDir <+= baseDirectory / "public/javascripts/lib",
    jasmineTestDir <+= baseDirectory / "test/assets/",
    jasmineConfFile <+= baseDirectory / "test/assets/test.dependencies.js",
    (test in Test) <<= (test in Test) dependsOn (jasmine),
    Tasks.tsdTask,
    Tasks.tsdTestTask
  )

}
