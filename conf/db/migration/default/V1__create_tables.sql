DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  permission VARCHAR(128) NOT NULL,
  created DATETIME NOT NULL,
  deleted DATETIME,
  PRIMARY KEY(id)
) ENGINE=MyISAM DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;

DROP TABLE IF EXISTS items;
CREATE TABLE items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  content TEXT NOT NULL,
  words TEXT NOT NULL,
  created DATETIME NOT NULL,
  modified DATETIME NOT NULL,
  deleted DATETIME,
  account_id BIGINT NOT Null,
  PRIMARY KEY(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  INDEX (account_id, created),
  FULLTEXT (words)
) ENGINE=MyISAM DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;