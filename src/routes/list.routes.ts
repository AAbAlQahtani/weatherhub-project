import { Router } from 'express';
import * as ListController from '../controllers/list.controller';
import { authorized } from '../middleware/auth.middleware';

const router = Router();

// Authorized routes
router.use(authorized);

router.route('/')
  .post(ListController.createList)
  .get(ListController.getLists);

router.route('/:id')
  .get(ListController.getList)
  .patch(ListController.updateList)
  .delete(ListController.deleteList);

export default router; 