DROP TABLE IF EXISTS search_conditions;

CREATE TABLE search_conditions (
  condition_id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  target_type VARCHAR(255) NOT NULL,
  keywords VARCHAR(1024),
  tags VARCHAR(1024),
  account_id BIGINT NOT Null,
  sort_order INT NOT NULL,
  created_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY(condition_id),
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;
