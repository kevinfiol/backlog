-- Up
CREATE TABLE Section (
    sectionid   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    sectionname TEXT NOT NULL,
    slug        TEXT NOT NULL,
    listid      INTEGER NOT NULL,
    itemidOrder TEXT,
    FOREIGN KEY(listid) REFERENCES List(listid)
);

-- Down
DROP TABLE Section;
