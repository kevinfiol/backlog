import request from '../util/request.js';
import typecheck from '../util/typecheck.js';

const GameService = {
    init(db, key) {
        this.db = db;
        this.key = key;
        this.endpoint = 'https://api.rawg.io/api/games';
    },

    async search(name) {
        try {
            typecheck({ string: name });
            const response = await request.get(this.endpoint, {
                key: this.key,
                search: name.trim(),
                page: 1,
                page_size: 4
            });

            if (!response.statusMessage === 'OK') throw Error(response.statusCode);
            let results = response.data.results.slice(0, 4);

            // only get data you need
            results = results.map(result => {
                return {
                    name: result.name,
                    url: this.gameUrl(result.slug)
                };
            });

            typecheck({ array: results });
            return results;
        } catch(e) {
            throw Error('Unable to retrieve Game search results: ' + e);
        }
    },

    gameUrl(slug) {
        return `https://rawg.io/games/${slug}`;
    }
};

export default GameService;