
ALTER TABLE tasks ADD COLUMN title VARCHAR(256);

UPDATE tasks
  JOIN items ON items.item_id = tasks.item_id
  SET title = LEFT(SUBSTRING_INDEX(items.content, '\n', 1),80);

ALTER TABLE tasks MODIFY COLUMN title VARCHAR(256) NOT NULL;

DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
  item_id BIGINT,
  parent_id BIGINT,
  PRIMARY KEY (item_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id),
  FOREIGN KEY (parent_id) REFERENCES items(item_id)
) ENGINE=InnoDB DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci;
