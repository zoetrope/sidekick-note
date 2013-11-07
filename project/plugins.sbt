// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.1")

// Build.scalaに同じ設定があるけど、scalikejdbc-mapper-generatorのために必要。
libraryDependencies += "mysql" % "mysql-connector-java" % "5.1.26"

addSbtPlugin("com.github.seratch" %% "scalikejdbc-mapper-generator" % "1.6.10")

addSbtPlugin("com.github.mpeltonen" % "sbt-idea" % "1.5.2")

addSbtPlugin("com.timushev.sbt" % "sbt-updates" % "0.1.2")