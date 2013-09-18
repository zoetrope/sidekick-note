import sbt._

object plugins extends Build {
  lazy val root = Project("plugins", file(".")) dependsOn(
    uri("git://github.com/zoetrope/play2-typescript.git#ts-0.9.1"),
    uri("git://github.com/guardian/sbt-jasmine-plugin.git#0.8")
    )
}
