const polka = require('polka');
const IndexController = require('./controllers/web/IndexController.js');
const UserController = require('./controllers/web/UserController.js');
const ListController = require('./controllers/api/ListController.js');

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

// ListController
router.get('/api/list/getFullList/', ListController.getFullList);
router.post('/api/list/addItem/', ListController.addItem);
router.post('/api/list/editItem/', ListController.editItem);

module.exports = router;