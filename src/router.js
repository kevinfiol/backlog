import polka from 'polka';
import * as IndexController from './controllers/web/IndexController.js';
import * as UserController from './controllers/web/UserController.js';
import * as ListController from './controllers/api/ListController.js';

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
router.post('/api/list/removeList', ListController.removeList);

router.post('/api/list/addItem/', ListController.addItem);
router.post('/api/list/editItem/', ListController.editItem);
router.post('/api/list/removeItem/', ListController.removeItem);
router.post('/api/list/sortItems/', ListController.sortItems);

router.post('/api/list/sortSections/', ListController.sortSections);
router.post('/api/list/removeSection/', ListController.removeSection);
router.post('/api/list/renameSection/', ListController.renameSection);

export default router;