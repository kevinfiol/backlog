import slugify from '../util/slugify.js';
import typecheck from '../util/typecheck.js';

const SectionService = {
    init(db) {
        this.db = db;
    },

    async getSection({ sectionid }) {
        try {
            typecheck({ number: sectionid });
            let section = await this.db.get('Section', { sectionid });
            if (section === undefined) section = {};

            typecheck({ object: section });
            return section;
        } catch(e) {
            throw Error('Could not retrieve Section by sectionid: ' + e);
        }
    },

    async getSectionsByListid({ listid }) {
        try {
            typecheck({ number: listid });
            const sections = await this.db.all('Section', { listid }, 'sectionid');
            const sectonids = sections.map(section => section.sectionid);

            typecheck({ array: sectonids });
            return sectonids;
        } catch(e) {
            throw Error('Could not retrieve Sections by listid: ' + e);
        }
    },

    async updateItemOrder({ sectionid, itemidOrder }) {
        try {
            typecheck({ number: sectionid, string: itemidOrder });

            const result = await this.db.update('Section', {
                itemidOrder: itemidOrder.trim(),
            }, {
                sectionid
            });

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Unable to update Section: ' + e);
        }
    },

    async addSection({ listid, sectionname }) {
        try {
            typecheck({ number: listid });

            const result = await this.db.insert('Section', {
                sectionname: sectionname.trim(),
                slug: slugify(sectionname),
                listid,
                itemidOrder: ''
            });

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Unable to add Section: ' + e);
        }
    },

    async editSection({ sectionid, sectionname }) {
        try {
            typecheck({ number: sectionid, string: sectionname });

            const result = await this.db.update('Section', {
                sectionname: sectionname.trim()
            }, {
                sectionid
            });

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Unable to update Section: ' + e);
        }
    },

    async removeSection({ sectionid }) {
        try {
            typecheck({ number: sectionid });

            // must update sectionidOrder for given List
            const [list] = await this.db.query(`
                SELECT List.listid, List.sectionidOrder
                FROM List
                LEFT JOIN Section ON List.listid = Section.listid
                WHERE Section.sectionid = :sectionid
            `, {
                ':sectionid': sectionid
            });

            if (list === undefined) throw Error('Could not retrieve List for section');

            const sectionids = list.sectionidOrder.split(',').map(sectionid => parseInt(sectionid));
            const idx = sectionids.findIndex(i => i === sectionid);
            sectionids.splice(idx, 1);
            const sectionidOrder = sectionids.join(',');

            await this.db.exec(`
                BEGIN TRANSACTION;

                DELETE FROM Section
                WHERE sectionid = ${sectionid};

                DELETE FROM Item
                WHERE sectionid = ${sectionid};

                UPDATE List
                SET sectionidOrder = '${sectionidOrder}'
                WHERE listid = ${list.listid};

                COMMIT;
            `);
        } catch(e) {
            throw Error('Unable to remove Section: ' + e);
        }
    }
};

export default SectionService;