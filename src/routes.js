const polka = require('polka');
const IndexController = require('./controllers/IndexController.js');
const UserController = require('./controllers/UserController.js');

const router = polka();

// IndexController
router.get('/', IndexController.index);
router.get('/login', IndexController.login);
router.get('/logout', IndexController.logout);
router.get('/signup', IndexController.signup);

router.post('/login', IndexController.login);
router.post('/signup', IndexController.signup);

// UserController
router.get('/:username', UserController.user);
router.get('/:username/:listSlug', UserController.list);

module.exports = router;