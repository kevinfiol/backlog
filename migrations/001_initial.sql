-- Up
CREATE TABLE User (
    id       INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT    NOT NULL UNIQUE,
    password TEXT    NOT NULL,
    salt     TEXT    NOT NULL UNIQUE
);

-- Down
DROP TABLE User;