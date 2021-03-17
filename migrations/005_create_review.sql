-- Up
CREATE TABLE Review (
    reviewid       INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    reviewname     TEXT NOT NULL,
    reviewtext     TEXT,
    userid         INTEGER NOT NULL,
    date_created   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_updated   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(userid) REFERENCES User(userid)
);

-- Down
DROP TABLE Review;
