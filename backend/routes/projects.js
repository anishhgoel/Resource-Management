
// routes/projects.js
import express from 'express';
import auth from '../middleware/auth.js';
import Project from '../models/Project.js';

const router = express.Router();

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    // Populate client field with name and email
    const projects = await Project.find().populate('client', 'name email');
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, deadline, clientId } = req.body;
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }
    // Create new project
    const project = new Project({
      title,
      description,
      deadline,
      client: clientId  // Optionally assign a client if provided
    });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;