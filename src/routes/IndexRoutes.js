const polka = require('polka');
const IndexController = require('../controllers/IndexController.js');

const router = polka();
router.get('/', IndexController.index);
router.get('/login', IndexController.login);
router.get('/signup', IndexController.signup);

router.post('/login', IndexController.login);
router.post('/signup', IndexController.signup);

module.exports = router;