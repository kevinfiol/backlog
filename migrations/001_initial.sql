-- Up

CREATE TABLE User (
    id       INTEGER PRIMARY KEY,
    username TEXT    NOT NULL,
    password TEXT    NOT NULL
);

-- Down

DROP TABLE User;