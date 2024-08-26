import express from 'express';
import prisma from '../prisma/config.js'; // Sesuaikan dengan path dan format ESM
import * as timkerjaService from '../services/timKerjaService.js';

const router = express.Router();


// full direct
router.get('/team', async (req, res) => {
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
        id:subActivity.id,
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
router.get('/team', async (req, res) => {
  try {
    const timkerja = await timkerjaService.getAllTimkerja();
    res.json(timkerja);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/team', async (req, res) => {
  try {
    const team = await timkerjaService.createTimkerja(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/team/:id', async (req, res) => {
  try {
    const team = await timkerjaService.updateTimkerja(req.params.id, req.body);
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    const team = await timkerjaService.deleteTimkerja(req.params.id);
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// archive team


// Add an Activity
router.post('/team/:teamId/activities', async (req, res) => {
  const { teamId } = req.params;
  const { name } = req.body;
  try {
      const activity = await prisma.kegiatan.create({
          data: {
              name,
              timkerja_id: parseInt(teamId)
          }
      });
      res.json(activity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Rename an Activity
router.patch('/team/:teamId/activities/:activityId', async (req, res) => {
  const { teamId, activityId } = req.params;
  const { name } = req.body;
  try {
      const activity = await prisma.kegiatan.update({
          where: { id: parseInt(activityId) },
          data: { name }
      });
      res.json(activity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete an Activity
router.delete('/team/:teamId/activities/:activityId', async (req, res) => {
  const { teamId, activityId } = req.params;
  try {
      const activity = await prisma.kegiatan.delete({
          where: { id: parseInt(activityId) }
      });
      res.json(activity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// archive kegiatan

// Add a Sub-Activity
router.post('/team/:teamId/activities/:activityId/sub-activities', async (req, res) => {
  const { activityId } = req.params;
  const { name } = req.body;
  try {
      const subActivity = await prisma.subkegiatan.create({
          data: {
              name,
              kegiatan_id: parseInt(activityId)
          }
      });
      res.json(subActivity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Rename a Sub-Activity
router.patch('/team/:teamId/activities/:activityId/sub-activities/:subActivityId', async (req, res) => {
  const { subActivityId } = req.params;
  const { name } = req.body;
  try {
      const subActivity = await prisma.subkegiatan.update({
          where: { id: parseInt(subActivityId) },
          data: { name }
      });
      res.json(subActivity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a Sub-Activity
router.delete('/team/:teamId/activities/:activityId/sub-activities/:subActivityId', async (req, res) => {
  const { subActivityId } = req.params;
  try {
      const subActivity = await prisma.subkegiatan.delete({
          where: { id: parseInt(subActivityId) }
      });
      res.json(subActivity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// archive subkeg

// Add a Task
router.post('/team/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks', async (req, res) => {
  const { subActivityId } = req.params;
  const { name, dueDate, link, dateCreated } = req.body;
  try {
      const task = await prisma.tugas.create({
          data: {
              name,
              dateCreated: new Date(dateCreated),
              dueDate: new Date(dueDate),
              link,
              subkegiatan_id: parseInt(subActivityId)
          }
      });
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Rename a Task
router.patch('/team/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { name } = req.body;
  try {
      const task = await prisma.tugas.update({
          where: { id: parseInt(taskId) },
          data: { name }
      });
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a Task
router.delete('/team/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
      const task = await prisma.tugas.delete({
          where: { id: parseInt(taskId) }
      });
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// archive task

// Toggle Task Completion
router.patch('/team/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/completion', async (req, res) => {
  const { taskId } = req.params;
  try {
      // Temukan tugas berdasarkan ID
      const task = await prisma.tugas.findUnique({
          where: { id: parseInt(taskId) }
      });

      // Jika tugas ditemukan, update status completion
      if (task) {
          const updatedTask = await prisma.tugas.update({
              where: { id: parseInt(taskId) },
              data: { completed: !task.completed } // Toggle status completed
          });
          res.json(updatedTask);
      } else {
          res.status(404).json({ error: 'Task not found' });
      }
  } catch (error) {
      console.error('Error updating task completion:', error); // Tambahkan log untuk debugging
      res.status(500).json({ error: error.message });
  }
});


// Handle Deadline Change
router.patch('/team/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/deadline', async (req, res) => {
  const { taskId } = req.params;
  const { newDeadline } = req.body;
  try {
      const task = await prisma.tugas.update({
          where: { id: parseInt(taskId) },
          data: { dueDate: new Date(newDeadline) }
      });
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Handle Link Change
router.patch('/team/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/link', async (req, res) => {
  const { taskId } = req.params;
  const { newLink } = req.body;
  try {
      const task = await prisma.tugas.update({
          where: { id: parseInt(taskId) },
          data: { link: newLink }
      });
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

export default router;
