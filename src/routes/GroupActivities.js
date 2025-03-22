import express from 'express';
import { createGroup,
     addExpense,
      calculateSettlement, 
      getGroups,
      getGroupById } from '../controllers/groupActivities.controller.js';

const router = express.Router();

router.post('/createGroup', createGroup);
router.post('/add-expense', addExpense);
router.get('/group/:createdBy', getGroups);
router.get('/groupById/:groupId', getGroupById);
router.get('/settlement/:groupId', calculateSettlement);

export default router;
