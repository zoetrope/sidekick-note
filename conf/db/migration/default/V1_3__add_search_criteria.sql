DROP TABLE IF EXISTS search_conditions;
DROP TABLE IF EXISTS search_criteria;

CREATE TABLE search_criteria (
  criterion_id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(256) NOT NULL,
  target_type VARCHAR(256) NOT NULL,
  query VARCHAR(2048),
  account_id BIGINT NOT Null,
  sort_order INT NOT NULL,
  created_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY(criterion_id),
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;
