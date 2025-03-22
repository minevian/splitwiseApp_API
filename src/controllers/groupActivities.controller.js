// import Group from '../models/group.js';  // Import your Group model

// // Create Group
// export const createGroup = async (req, res) => {
//     const {userId, groupName, members, expenses } = req.body;

//     if (!groupName || !members || members.length === 0) {
//         return res.status(400).json({ success: false, message: 'Group name and members are required' });
//     }

//     try {
//         const newGroup = new Group({
//             groupName,
//             members,
//             expenses: expenses || [] // Initialize with empty expenses if none provided
//         });

//         await newGroup.save();

//         res.status(201).json({
//             success: true,
//             message: 'Group created successfully',
//             data: newGroup
//         });

//     } catch (error) {
//         console.error('Error creating group:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };



// // Get all groups
// export const getGroups = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const groups = await Group.find({ createdBy: userId });

//         res.status(200).json({
//             success: true,
//             data: groups
//         });

//     } catch (error) {
//         console.error('Error fetching groups:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };

import Group from '../models/group.js';

// Create a new group
export const createGroup = async (req, res) => {
  const { groupName, createdBy, members } = req.body;

  try {
    const group = new Group({
      groupName,
      createdBy,
      members
    });

    await group.save();
    res.status(201).json({ success: true, message: 'Group created successfully', group });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating group', error });
  }
};

// Add expense to the group
export const addExpense = async (req, res) => {
  const { groupId, description, amount, paidBy } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    group.expenses.push({ description, amount, paidBy });

    // Update member's paid amount
    const payer = group.members.find(member => member.userName === paidBy);
    if (payer) {
      payer.amountPaid += amount;
    }

    await group.save();
    res.status(200).json({ success: true, message: 'Expense added successfully', group });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding expense', error });
  }
};

// Calculate settlement
export const calculateSettlement = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const totalExpense = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const average = totalExpense / group.members.length;

    group.members.forEach(member => {
      member.owes = average - member.amountPaid;
      member.gets = member.amountPaid - average;
    });

    await group.save();
    res.status(200).json({ success: true, message: 'Settlement calculated', group });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error calculating settlement', error });
  }
};

// Get group details
export const getGroups = async (req, res) => {
  const { createdBy } = req.params;  // ✅ Match the route parameter name

  try {
      const groups = await Group.find({ createdBy });  // ✅ Use consistent naming

      if (!groups || groups.length === 0) {
          return res.status(404).json({ success: false, message: 'No groups found for this user' });
      }

      res.status(200).json({ success: true, groups });

  } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching groups', error });
  }
};


export const getGroupById = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    res.status(200).json({ success: true, group });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching group', error });
  }
};
