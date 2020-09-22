const polka = require('polka');
const IndexController = require('../controllers/IndexController.js');

const router = polka();
router.get('/', IndexController.indexAction);

module.exports = router;