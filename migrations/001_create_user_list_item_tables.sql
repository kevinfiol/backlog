-- Up
CREATE TABLE User (
    userid   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    username TEXT    NOT NULL UNIQUE,
    password TEXT    NOT NULL,
    salt     TEXT    NOT NULL UNIQUE
);

CREATE TABLE List (
    listid         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    listname       TEXT NOT NULL,
    slug           TEXT NOT NULL,
    userid         INTEGER NOT NULL,
    sectionidOrder TEXT,
    date_created   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_updated   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(userid) REFERENCES User(userid)
);

CREATE TABLE Section (
    sectionid   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    sectionname TEXT NOT NULL,
    slug        TEXT NOT NULL,
    listid      INTEGER NOT NULL,
    itemidOrder TEXT,
    FOREIGN KEY(listid) REFERENCES List(listid)
);

CREATE TABLE Item (
    itemid    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    itemname  TEXT NOT NULL,
    slug      TEXT NOT NULL,
    review    TEXT,
    url       TEXT,
    sectionid INTEGER NOT NULL,
    FOREIGN KEY(sectionid) REFERENCES Section(sectionid)
);

-- Down
DROP TABLE User;
DROP TABLE List;
DROP TABLE Section;
DROP TABLE Item;