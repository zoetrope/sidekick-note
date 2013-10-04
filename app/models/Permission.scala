package models

import org.json4s.CustomSerializer
import org.json4s.JsonAST.JString


sealed trait Permission

object Permission {
  case object Administrator extends Permission
  case object NormalUser extends Permission

  def valueOf(value: String): Permission = value match {
    case "Administrator" => Administrator
    case "NormalUser"    => NormalUser
    case _ => throw new IllegalArgumentException()
  }
}

class PermissionSerializer extends CustomSerializer[Permission](format =>
  ( {
    case x: JString => Permission.valueOf(x.toString)
  }, {
    case x: Permission => JString(x.toString)
  })
)

