package task

import org.json4s.CustomSerializer
import org.json4s.JsonAST.JString

sealed trait TaskStatus

object TaskStatus {
  case object Completed extends TaskStatus
  case object New extends TaskStatus

  def valueOf(value: String): TaskStatus = value match {
    case "Completed" => Completed
    case "New"    => New
    case _ => throw new IllegalArgumentException()
  }
}

class TaskStatusSerializer extends CustomSerializer[TaskStatus](format =>
  ( {
    case x: JString => TaskStatus.valueOf(x.toString)
  }, {
    case x: TaskStatus => JString(x.toString)
  })
)