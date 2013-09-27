DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS quicknotes;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS items_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS items;

CREATE TABLE accounts (
  account_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  permission VARCHAR(128) NOT NULL,
  language VARCHAR(128) NOT NULL,
  timezone VARCHAR(128) NOT NULL,
  created DATETIME NOT NULL,
  modified DATETIME NOT NULL,
  deleted DATETIME,
  PRIMARY KEY(account_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE items (
  item_id BIGINT NOT NULL AUTO_INCREMENT,
  content TEXT NOT NULL,
  words TEXT NOT NULL,
  rating INT NOT NULL,
  created DATETIME NOT NULL,
  modified DATETIME NOT NULL,
  deleted DATETIME,
  account_id BIGINT NOT Null,
  PRIMARY KEY(item_id),
  FOREIGN KEY (account_id) REFERENCES accounts(account_id),
  INDEX (account_id, created),
  FULLTEXT (words)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE quick_notes(
  item_id BIGINT,
  PRIMARY KEY (item_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE tasks (
  item_id BIGINT,
  status VARCHAR(32) NOT NULL,
  PRIMARY KEY (item_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE articles (
  item_id BIGINT,
  title TEXT NOT NULL,
  PRIMARY KEY (item_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE tags (
  tag_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR (32) NOT NULL,
  ref_count INT NOT NULL,
  PRIMARY KEY (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE items_tags (
  item_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  PRIMARY KEY (item_id, tag_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id),
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;
