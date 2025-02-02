import express from 'express';
import auth from '../middleware/auth.js';
import Project from '../models/Project.js';

const router = express.Router();

// to get all the projects
router.get('/', auth, async (req, res) => {
    try {
        let projects;
        
        if (req.user.role === 'client') {
          projects = await Project.find({ client: req.user.id })
            .populate('client', 'name email')
            .populate('team.user', 'name email');
        } 
        else if (req.user.role === 'team') {
          projects = await Project.find({ 
            'team.user': req.user.id 
          })
            .populate('client', 'name email')
            .populate('team.user', 'name email');
        }
        else if (req.user.role === 'admin') {
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

// create a new project
router.post('/', auth, async (req, res) => {
    try {
      const { title, description, deadline, clientId, team } = req.body;
      if (!title) {
        return res.status(400).json({ msg: 'Title is required' });
      }
  
      // Create project object
      const projectData = {
        title,
        description,
        deadline,
        // if user is a client, they are automatically the client
        // if admin/team, they can specify a client
        client: req.user.role === 'client' ? req.user.id : clientId,
        team: team || []
      };
  
      const project = new Project(projectData);
      await project.save();
      
      // Populate client details in response
      const populatedProject = await Project.findById(project._id)
        .populate('client', 'name email')
        .populate('team.user', 'name email');
        
      res.json(populatedProject);
    } catch (err) {
      console.error('Error creating project:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });


// to add team member to a project

// Add team members to a project
router.post('/:projectId/team', auth, async (req, res) => {
    try {
      const { userId, role, hoursAllocated } = req.body;
      const project = await Project.findById(req.params.projectId);
      
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }
  
      // check if user is already in team
      if (project.team.some(member => member.user.toString() === userId)) {
        return res.status(400).json({ msg: 'User already in team' });
      }
  
      project.team.push({
        user: userId,
        role,
        hoursAllocated
      });
  
      await project.save();
      
      const updatedProject = await Project.findById(req.params.projectId)
        .populate('client', 'name email')
        .populate('team.user', 'name email');
  
      res.json(updatedProject);
    } catch (err) {
      console.error('Error adding team member:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

export default router;  