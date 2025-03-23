

import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [
    {
      userName: String,
      email: String,
      amountPaid: Number,
      owes: Number,
      gets: Number
    }
  ],
  totalAmount: { type: Number, default: 0 },
  expenses: [
    {
      description: String,
      amount: Number,
      paidBy: String,
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
