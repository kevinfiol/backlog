import typecheck from '../util/typecheck.js';

const HLTBService = {
    init(service, db) {
        this.service = service;
        this.db = db;
    },

    async search(name) {
        typecheck({ string: name });
        let results;
        results = await this.service.search(name);

        typecheck({ array: results });
        return results;
    }
};

export default HLTBService;