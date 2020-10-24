-- Up
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

-- Down
DROP TABLE List;
