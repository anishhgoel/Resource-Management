import express from 'express';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const router = express.Router();

// GET all projects (filtered based on user role)
/*
 admin  : can get all projects 
        : can see all clients and all team members.

 client : can only get projects where they are listed as the client
        : can see client details (name, email) and team members assigned to the project


 team   : can only get projects where they are part of the team
        : can see client details (name, email) and team members assigned to the project
*/
router.get('/', auth, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'client') {
      projects = await Project.find({ client: req.user.id })
        .populate('client', 'name email')
        .populate('team.user', 'name email');
    } else if (req.user.role === 'team') {
      projects = await Project.find({ 'team.user': req.user.id })
        .populate('client', 'name email')
        .populate('team.user', 'name email');
    } else if (req.user.role === 'admin') {
      projects = await Project.find()
        .populate('client', 'name email')
        .populate('team.user', 'name email');
    }
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET a single project by project ID
router.get('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('client', 'name email')
      .populate('team.user', 'name email');
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    // clients can only access their own projects
    if (req.user.role === 'client' && project.client.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    // team members only access if assigned to their project
    if (req.user.role === 'team' && !project.team.some(member => member.user.toString() === req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    // if not client or team then would be admin, so can always see project
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create a new project (only admin and team can create)
router.post('/', auth, authorize(['admin', 'team']), async (req, res) => {
    try {
      const { title, description, deadline, clientId, team } = req.body;
      if (!title) {
        return res.status(400).json({ msg: 'Title is required' });
      }
      // if no clientId is provided, default to the logged-in user's ID.
      const client = clientId || req.user.id;
  
      const projectData = {
        title,
        description,
        deadline,
        client,  // use the provided clientId or default to req.user.id.
        team: team || []
      };
      const project = new Project(projectData);
      await project.save();
      const populatedProject = await Project.findById(project._id)
        .populate('client', 'name email')
        .populate('team.user', 'name email');
      res.json(populatedProject);
    } catch (err) {
      console.error('Error creating project:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

// PUT full update a project by ID (admin only)
router.put('/:projectId', auth, authorize(['admin']), async (req, res) => {
  try {
    const { title, description, deadline, status, clientId, team } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (status !== undefined) updateData.status = status;
    if (clientId !== undefined) updateData.client = clientId;
    if (team !== undefined) updateData.team = team;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $set: updateData },
      { new: true }
    )
      .populate('client', 'name email')
      .populate('team.user', 'name email');

    if (!updatedProject) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    const io = req.app.locals.io;
    io.emit('projectUpdated', updatedProject);
    res.json(updatedProject);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PATCH update project status and/or log hours (team members only)
router.patch('/:projectId/status', auth, authorize(['team']), async (req, res) => {
  try {
    const { status, logHours } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    // to verify the team member is part of the project
    const teamMember = project.team.find(member => member.user.toString() === req.user.id);
    if (!teamMember) {
      return res.status(403).json({ msg: 'Access denied: You are not a member of this project' });
    }
    if (status !== undefined) {
      project.status = status;
    }
    if (logHours !== undefined) {
      teamMember.hoursAllocated = logHours;
    }
    await project.save();
    const updatedProject = await Project.findById(req.params.projectId)
      .populate('client', 'name email')
      .populate('team.user', 'name email');
    res.json(updatedProject);
  } catch (err) {
    console.error('Error updating project status:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a project (admin only)
router.delete('/:projectId', auth, authorize(['admin']), async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.projectId);
    if (!deletedProject) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json({ msg: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST add a team member to a project (admin and team)
router.post('/:projectId/team', auth, authorize(['admin', 'team']), async (req, res) => {
  try {
    const { userEmail, role, hoursAllocated } = req.body;
    if (!userEmail) {
      return res.status(400).json({ msg: 'User email is required' });
    }
    // Look up the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ msg: 'User not found in system' });
    }
    // Find the project by its ID
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    // Check if the user is already in the team
    if (project.team.some(member => member.user && member.user.toString() === user._id.toString())) {
      return res.status(400).json({ msg: 'User already in team' });
    }
    // Add the new team member by storing the user's ObjectId
    project.team.push({ user: user._id, role, hoursAllocated });
    await project.save();
    // Populate the team field to return user details (name, email, etc.)
    const updatedProject = await Project.findById(req.params.projectId)
      .populate('client', 'name email')
      .populate('team.user', 'name email');
    // (Optional) Emit a Socket.IO event for notifications here
    res.json(updatedProject);
  } catch (err) {
    console.error('Error adding team member:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a team member to a project (admin and team)

router.delete('/:projectId/team', auth, authorize(['admin', 'team']), async (req, res) => {
    try {
      const { userID } = req.body;
      if (!userID) {
        return res.status(400).json({ msg: 'User ID is required for removal' });
      }
      // find the project by its ID
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }
      // filter out any team member with a matching user ID
      const initialLength = project.team.length;
      project.team = project.team.filter(member => {
        return member.user && member.user.toString() !== userID;
      });
      if (project.team.length === initialLength) {
        return res.status(400).json({ msg: 'Team member not found in project' });
      }
      await project.save();
      // populate the team field to return updated user details
      const updatedProject = await Project.findById(req.params.projectId)
        .populate('client', 'name email')
        .populate('team.user', 'name email');
      res.json(updatedProject);
    } catch (err) {
      console.error('Error removing team member:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

export default router;