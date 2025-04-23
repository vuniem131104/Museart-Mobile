DROP DATABASE IF EXISTS muse_art;
CREATE DATABASE IF NOT EXISTS muse_art;
USE muse_art;

-- Create tables
CREATE TABLE user (
  id INTEGER PRIMARY KEY KEY AUTO_INCREMENT,
  username VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE author (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  dob DATE
);

CREATE TABLE artwork (
  id INTEGER PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  date DATE,
  date_display DATE,
  place_of_origin VARCHAR(255),
  fiscal_year YEAR,
  dimensions VARCHAR(255),
  credit_line VARCHAR(255),
  inscription VARCHAR(255),
  created_at DATETIME,
  updated_at DATETIME,
  artist_id INTEGER NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES author(id)
);

CREATE TABLE artwork_reaction (
  id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  artwork_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (artwork_id) REFERENCES artwork(id),
  UNIQUE (user_id, artwork_id)
);

CREATE TABLE artwork_comment (
  id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  artwork_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (artwork_id) REFERENCES artwork(id)
);

CREATE TABLE exhibition (
  id INTEGER PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  start_time DATETIME,
  end_time DATETIME,
  updated_at DATETIME,
  status VARCHAR(50)
);

CREATE TABLE exhibition_reaction (
  id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  exhibition_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (exhibition_id) REFERENCES exhibition(id),
  UNIQUE (user_id, exhibition_id)
);

CREATE TABLE exhibition_comment (
  id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL, 
  exhibition_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (exhibition_id) REFERENCES exhibition(id)
);

CREATE TABLE exhibition_artwork (
  exhibition_id INTEGER NOT NULL,
  artwork_id INTEGER NOT NULL,
  FOREIGN KEY (exhibition_id) REFERENCES exhibition(id),
  FOREIGN KEY (artwork_id) REFERENCES artwork(id),
  UNIQUE (exhibition_id, artwork_id)
);

CREATE TABLE article (
  id INTEGER PRIMARY KEY NOT NULL,
  title VARCHAR(255),
  content TEXT,
  classification VARCHAR(100),
  created_at DATETIME,
  updated_at DATETIME,
  author_id INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES author(id)
);

CREATE TABLE tag (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(100) UNIQUE
);

CREATE TABLE artwork_tag (
  artwork_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (artwork_id) REFERENCES artwork(id),
  FOREIGN KEY (tag_id) REFERENCES tag(id),
  UNIQUE (artwork_id, tag_id)
);

CREATE TABLE exhibition_tag (
  exhibition_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (exhibition_id) REFERENCES exhibition(id),
  FOREIGN KEY (tag_id) REFERENCES tag(id),
  UNIQUE (exhibition_id, tag_id)
);

CREATE TABLE article_tag (
  article_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (article_id) REFERENCES article(id),
  FOREIGN KEY (tag_id) REFERENCES tag(id),
  UNIQUE (article_id, tag_id)
);

CREATE TABLE bookmark (
  id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id INTEGER NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES user(id),
  UNIQUE (user_id, target_type, target_id)
);

CREATE TABLE store_item (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  classification VARCHAR(100),
  image_url VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE cart_item (
  id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  added_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (item_id) REFERENCES store_item(id),
  UNIQUE (user_id, item_id)
);
