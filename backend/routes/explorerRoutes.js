import express from 'express';
import prisma from '../prisma/config.js'; // Sesuaikan dengan path dan format ESM
import * as timkerjaService from '../services/timKerjaService.js';
import * as kegiatanService from '../services/kegiatanService.js';
import * as subkegiatanService from '../services/subkegiatanService.js';
import * as tugasService from '../services/tugasService.js';

const router = express.Router();


// full direct
router.get('/teams', async (req, res) => {
  try {
    const teams = await getTeams();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const getTeams = async () => {
  const teams = await prisma.timkerja.findMany({
    include: {
      kegiatan: {
        include: {
          subkegiatan: {
            include: {
              tugas: true,
            },
          },
        },
      },
    },
  });
  return teams.map(team => ({
    id: team.id,
    name: team.name,
    activities: team.kegiatan.map(activity => ({
      id: activity.id,
      name: activity.name,
      subActivities: activity.subkegiatan.map(subActivity => ({
        id: subActivity.id,
        name: subActivity.name,
        tasks: subActivity.tugas.map(task => ({
          id: task.id,
          name: task.name,
          dateCreated: task.dateCreated.toISOString().split('T')[0],
          dueDate: task.dueDate.toISOString().split('T')[0],
          dateUpload: task.dateUpload ? task.dateUpload.toISOString().split('T')[0] : '',
          link: task.link || '',
          completed: task.completed,
        })),
      })),
    })),
    links: team.links || [],
  }));
};

// Add a Team
router.get('/teams', async (req, res) => {
  try {
    const timkerja = await timkerjaService.getAllTimkerja();
    res.json(timkerja);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/teams', async (req, res) => {
  try {
    const team = await timkerjaService.createTimkerja(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/teams/:id', async (req, res) => {
  try {
    const team = await timkerjaService.updateTimkerja(req.params.id, req.body);
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/teams/:id', async (req, res) => {
  try {
    const team = await timkerjaService.deleteTimkerja(req.params.id);
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// archive team

// Get Activities by Team ID
router.get('/teams/:teamId/activities', async (req, res) => {
  try {
    const { teamId } = req.params;
    const activities = await kegiatanService.getKegiatanByTeamId(teamId);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add an Activity
router.post('/teams/:teamId/activities', async (req, res) => {
  const { teamId } = req.params;
  const { name } = req.body;
  try {
    const activity = await kegiatanService.createKegiatan({
      name,
      timkerja_id: parseInt(teamId)
    });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename an Activity
router.patch('/teams/:teamId/activities/:activityId', async (req, res) => {
  const { activityId } = req.params;
  const { name } = req.body;
  try {
    const activity = await kegiatanService.updateKegiatan(activityId, { name });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an Activity
router.delete('/teams/:teamId/activities/:activityId', async (req, res) => {
  const { activityId } = req.params;
  try {
    const activity = await kegiatanService.deleteKegiatan(activityId);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// archive kegiatan

// Get Sub-Activities by Activity ID
router.get('/teams/:teamId/activities/:activityId/sub-activities', async (req, res) => {
  try {
    const { activityId } = req.params;
    const subActivities = await subkegiatanService.getSubkegiatanByActivityId(activityId);
    res.json(subActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a Sub-Activity
router.post('/teams/:teamId/activities/:activityId/sub-activities', async (req, res) => {
  const { activityId } = req.params;
  const { name } = req.body;
  try {
    const subActivity = await subkegiatanService.createSubkegiatan({
      name,
      kegiatan_id: parseInt(activityId)
    });
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename a Sub-Activity
router.patch('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId', async (req, res) => {
  const { subActivityId } = req.params;
  const { name } = req.body;
  try {
    const subActivity = await subkegiatanService.updateSubkegiatan(subActivityId, { name });
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Sub-Activity
router.delete('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId', async (req, res) => {
  const { subActivityId } = req.params;
  try {
    const subActivity = await subkegiatanService.deleteSubkegiatan(subActivityId);
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// archive subkeg

// Get all tasks for a specific sub-activity
router.get('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks', async (req, res) => {
  const { subActivityId } = req.params;
  try {
    const tasks = await tugasService.getTugasBySubkegiatanId(subActivityId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add a Task
router.post('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks', async (req, res) => {
  const { subActivityId } = req.params;
  const { name, dueDate, link, dateCreated } = req.body;
  try {
    const task = await tugasService.createTugas({
      name,
      dateCreated: new Date(dateCreated),
      dueDate: new Date(dueDate),
      link,
      subkegiatan_id: parseInt(subActivityId)
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename a Task
router.patch('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { name } = req.body;
  try {
    const task = await tugasService.updateTugas(taskId, { name });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Task
router.delete('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await tugasService.deleteTugas(taskId);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// archive tugas

// Toggle Task Completion
router.patch('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/completion', async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await tugasService.toggleTugasCompletion(taskId);
    res.json(task);
  } catch (error) {
    console.error('Error updating task completion:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle Deadline Change
router.patch('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/deadline', async (req, res) => {
  const { taskId } = req.params;
  const { newDeadline } = req.body;
  try {
    const task = await tugasService.updateTugasDeadline(taskId, newDeadline);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle Link Change
router.patch('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/link', async (req, res) => {
  const { taskId } = req.params;
  const { newLink } = req.body;
  try {
    const task = await tugasService.updateTugasLink(taskId, newLink);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
