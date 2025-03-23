import express from 'express';
import { createGroup,
     addExpense,
   
      getGroups,
      getGroupById } from '../controllers/groupActivities.controller.js';

const router = express.Router();

router.post('/createGroup', createGroup);
router.post('/addExpense', addExpense);
router.get('/group/:createdBy', getGroups);
router.get('/groupById/:groupId', getGroupById);


export default router;
