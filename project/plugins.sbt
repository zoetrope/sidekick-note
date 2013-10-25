// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

// Use the Play sbt plugin for Play projects
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.0")

libraryDependencies += "mysql" % "mysql-connector-java" % "5.1.26"

//addSbtPlugin("com.github.seratch" %% "scalikejdbc-mapper-generator" % "[1.6,")

addSbtPlugin("com.github.mpeltonen" % "sbt-idea" % "1.5.1")