import api from '../api.js';

const createGameSource = (controller) => async (query, done) => {
    if (controller) controller.abort();
    controller = new AbortController();

    try {
        let choices = [];
        const response = await api.searchGame(query, { signal: controller.signal });
        controller = null;

        if (response.data.results && response.data.results.length > 0) {
            choices = response.data.results.map(result => {
                return { label: result.name, value: result.name, url: result.url };
            });
        }

        done(choices);
    } catch(err) {
        if (err.name !== 'AbortError') {
            done([]);
            throw err;
        }
    }
};

export default createGameSource;