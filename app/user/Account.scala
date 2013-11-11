package user

import scalikejdbc._
import scalikejdbc.SQLInterpolation._
import org.joda.time.DateTime
import org.mindrot.jbcrypt.BCrypt
import auth.Permission

case class Account
(
  accountId: Long,
  name: String,
  password: String,
  permission: Permission,
  language: String,
  timezone: String,
  createdAt: DateTime,
  modifiedAt: DateTime,
  deletedAt: Option[DateTime] = None) {

  def save()(implicit session: DBSession = Account.autoSession): Account = Account.save(this)(session)

  def destroy()(implicit session: DBSession = Account.autoSession): Unit = Account.destroy(this)(session)
}

object Account extends SQLSyntaxSupport[Account] {

  override val tableName = "accounts"

  override val columns = Seq("account_id", "name", "password", "permission", "language", "timezone", "created_at", "modified_at", "deleted_at")

  def apply(a: SyntaxProvider[Account])(rs: WrappedResultSet): Account = apply(a.resultName)(rs)

  def apply(a: ResultName[Account])(rs: WrappedResultSet): Account = new Account(
    accountId = rs.long(a.accountId),
    name = rs.string(a.name),
    password = rs.string(a.password),
    permission = Permission.valueOf(rs.string(a.permission)),
    language = rs.string(a.language),
    timezone = rs.string(a.timezone),
    createdAt = rs.timestamp(a.createdAt).toDateTime,
    modifiedAt = rs.timestamp(a.modifiedAt).toDateTime,
    deletedAt = rs.timestampOpt(a.deletedAt).map(_.toDateTime)
  )

  val a = Account.syntax("a")

  val autoSession = AutoSession

  def authenticate(name: String, password: String)(implicit s: DBSession = autoSession): Option[Account] = {
    val res = findByName(name).filter {
      account => BCrypt.checkpw(password, account.password)
    }
    return res
  }

  def findByName(name: String)(implicit s: DBSession = autoSession): Option[Account] = withSQL {
    select.from(Account as a).where.eq(a.name, name)
  }.map(Account(a)).single.apply()

  def findById(accountId: Long)(implicit session: DBSession = autoSession): Option[Account] = {
    withSQL {
      select.from(Account as a).where.eq(a.accountId, accountId)
    }.map(Account(a.resultName)).single.apply()
  }

  def countAll()(implicit session: DBSession = autoSession): Long = {
    withSQL(select(sqls"count(1)").from(Account as a)).map(rs => rs.long(1)).single.apply().get
  }

  def create
  (
    name: String,
    password: String,
    permission: String,
    language: String,
    timezone: String,
    createdAt: DateTime,
    modifiedAt: DateTime,
    deletedAt: Option[DateTime] = None)(implicit session: DBSession = autoSession): Account = {
    val generatedKey = withSQL {
      val hashedPass = BCrypt.hashpw(password, BCrypt.gensalt())
      insert.into(Account).columns(
        column.name,
        column.password,
        column.permission,
        column.language,
        column.timezone,
        column.createdAt,
        column.modifiedAt,
        column.deletedAt
      ).values(
        name,
        hashedPass,
        permission,
        language,
        timezone,
        createdAt,
        modifiedAt,
        deletedAt
      )
    }.updateAndReturnGeneratedKey.apply()

    Account(
      accountId = generatedKey,
      name = name,
      password = password,
      permission = Permission.valueOf(permission),
      language = language,
      timezone = timezone,
      createdAt = createdAt,
      modifiedAt = modifiedAt,
      deletedAt = deletedAt)
  }

  def save(entity: Account)(implicit session: DBSession = autoSession): Account = {
    withSQL {
      update(Account as a).set(
        a.accountId -> entity.accountId,
        a.name -> entity.name,
        a.password -> entity.password,
        a.permission -> entity.permission,
        a.language -> entity.language,
        a.timezone -> entity.timezone,
        a.createdAt -> entity.createdAt,
        a.modifiedAt -> entity.modifiedAt,
        a.deletedAt -> entity.deletedAt
      ).where.eq(a.accountId, entity.accountId)
    }.update.apply()
    entity
  }

  def destroy(entity: Account)(implicit session: DBSession = autoSession): Unit = {
    withSQL {
      delete.from(Account).where.eq(column.accountId, entity.accountId)
    }.update.apply()
  }

}
