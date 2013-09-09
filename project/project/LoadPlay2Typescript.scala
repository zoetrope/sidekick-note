import sbt._

object LoadPlay2Typescript extends Build {
  lazy val root = Project("plugins", file(".")) dependsOn(
    uri("git://github.com/zoetrope/play2-typescript.git#ts-0.9.1")
    )
}
