-- Up

CREATE TABLE User (
    id       INTEGER PRIMARY KEY,
    username TEXT    NOT NULL UNIQUE,
    password TEXT    NOT NULL
);

-- Down

DROP TABLE User;