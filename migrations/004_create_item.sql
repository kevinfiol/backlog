-- Up
CREATE TABLE Item (
    itemid    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    itemname  TEXT NOT NULL,
    slug      TEXT NOT NULL,
    url       TEXT,
    sectionid INTEGER NOT NULL,
    FOREIGN KEY(sectionid) REFERENCES Section(sectionid)
);

-- Down
DROP TABLE Item;
