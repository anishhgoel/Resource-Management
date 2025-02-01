import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, default: Date.now },
  deadline: Date,
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Review', 'Completed'],
    default: 'Planning'
  },
  team: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: String,
      hoursAllocated: Number
    }
  ]
});

export default mongoose.model('Project', projectSchema);