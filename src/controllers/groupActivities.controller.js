

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




const calculateSettlement = (expenses, members) => {
  const settlement = {};


  members.forEach(member => {
    settlement[member.userName] = 0;
    member.ows = 0;
    member.gets = 0;
  });

  // Calculate the total expense
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const share = totalExpense / members.length;

  // Calculate each member's net balance
  members.forEach(member => {
    const amountPaid = expenses
      .filter(exp => exp.paidBy === member.userName)
      .reduce((sum, exp) => sum + exp.amount, 0);

    const netBalance = amountPaid - share;

    settlement[member.userName] = netBalance;

    if (netBalance > 0) {
      member.gets = netBalance;  // Member should receive money
    } else if (netBalance < 0) {
      member.ows = -netBalance;  // Member needs to pay money
    }
  });

  // Generate payers and receivers
  const payers = [];
  const receivers = [];

  for (const [userName, amount] of Object.entries(settlement)) {
    if (amount > 0) {
      receivers.push({ userName, amount });
    } else if (amount < 0) {
      payers.push({ userName, amount: -amount });
    }
  }

  // Sort payers and receivers
  payers.sort((a, b) => a.amount - b.amount);
  receivers.sort((a, b) => b.amount - a.amount);

  const finalSettlements = [];

  let i = 0, j = 0;

  while (i < payers.length && j < receivers.length) {
    const payAmount = Math.min(payers[i].amount, receivers[j].amount);

    finalSettlements.push({
      from: payers[i].userName,
      to: receivers[j].userName,
      amount: payAmount.toFixed(2)
    });

    payers[i].amount -= payAmount;
    receivers[j].amount -= payAmount;

    if (payers[i].amount === 0) i++;
    if (receivers[j].amount === 0) j++;
  }

  return finalSettlements;
};

export const addExpense = async (req, res) => {
  const { groupId, description, amount, paidBy } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }


    group.expenses.push({ description, amount, paidBy });

    const payer = group.members.find(member => member.userName === paidBy);
    if (payer) {
      payer.amountPaid += amount;
    }

    const finalSettlements = calculateSettlement(group.expenses, group.members);

    group.settlements = finalSettlements;
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Expense added and settlement calculated successfully',
      settlements: finalSettlements,
      members: group.members.map(member => ({
        userName: member.userName,
        amountPaid: member.amountPaid,
        ows: member.ows,
        gets: member.gets
      })),
      group
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding expense', error });
  }
};


export const getGroupById = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }


    const settlements = calculateSettlement(group.expenses, group.members);

    res.status(200).json({
      success: true,
      group: {
        ...group.toObject(),
        settlements,
        members: group.members.map(member => ({
          userName: member.userName,
          email: member.email,
          amountPaid: member.amountPaid,
          owes: member.ows, 
          gets: member.gets
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching group', error });
  }
};

