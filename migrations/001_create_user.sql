-- Up
CREATE TABLE User (
    userid   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    username TEXT    NOT NULL UNIQUE,
    password TEXT    NOT NULL,
    salt     TEXT    NOT NULL UNIQUE
);

-- Down
DROP TABLE User;
