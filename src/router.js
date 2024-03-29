import polka from 'polka';
import * as IndexController from './controllers/web/IndexController.js';
import * as UserController from './controllers/web/UserController.js';
import * as ListController from './controllers/api/ListController.js';
import * as HowLongToBeat from './controllers/api/HowLongToBeat.js';
import * as GameController from './controllers/api/GameController.js';

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
router.get('/:username/reviews', UserController.reviews);
router.get('/:username/:listSlug', UserController.list);
router.get('/:username/list/create', UserController.createList);
router.get('/:username/list/remove/:listid', UserController.removeList);
router.get('/:username/review/create', UserController.createReview);
router.get('/:username/review/edit/:reviewid', UserController.editReview);
router.get('/:username/review/remove/:reviewid', UserController.removeReview);

router.post('/:username/list/create', UserController.createList);
router.post('/:username/list/remove/:listid', UserController.removeList);

router.post('/:username/review/create', UserController.createReview);
router.post('/:username/review/edit/:reviewid', UserController.editReview);
router.post('/:username/review/remove/:reviewid', UserController.removeReview);

// ListController
router.get('/api/list/getFullList/', ListController.getFullList);
router.post('/api/list/removeList', ListController.removeList);
router.post('/api/list/updateListOrders/', ListController.updateListOrders);

router.post('/api/list/addItem/', ListController.addItem);
router.post('/api/list/editItem/', ListController.editItem);
router.post('/api/list/removeItem/', ListController.removeItem);

router.post('/api/list/addSection/', ListController.addSection);
router.post('/api/list/editSection/', ListController.editSection);
router.post('/api/list/removeSection/', ListController.removeSection);
router.post('/api/list/renameSection/', ListController.renameSection);

router.post('/api/game/search/', GameController.search);
router.post('/api/hltb/search/', HowLongToBeat.search);

export default router;