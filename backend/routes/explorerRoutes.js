const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
  const teams = await prisma.Timkerja.findMany({
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
router.post('/teams', async (req, res) => {
  const { name } = req.body;
  try {
      const team = await prisma.Timkerja.create({
          data: { name }
      });
      res.json(team);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Rename a Team
router.put('/teams/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
      const team = await prisma.Timkerja.update({
          where: { id: parseInt(id) },
          data: { name }
      });
      res.json(team);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a Team
router.delete('/teams/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const team = await prisma.Timkerja.delete({
          where: { id: parseInt(id) }
      });
      res.json(team);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Add an Activity
router.post('/teams/:teamId/activities', async (req, res) => {
  const { teamId } = req.params;
  const { name } = req.body;
  try {
      const activity = await prisma.Kegiatan.create({
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
router.put('/teams/:teamId/activities/:activityId', async (req, res) => {
  const { teamId, activityId } = req.params;
  const { name } = req.body;
  try {
      const activity = await prisma.Kegiatan.update({
          where: { id: parseInt(activityId) },
          data: { name }
      });
      res.json(activity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete an Activity
router.delete('/teams/:teamId/activities/:activityId', async (req, res) => {
  const { teamId, activityId } = req.params;
  try {
      const activity = await prisma.Kegiatan.delete({
          where: { id: parseInt(activityId) }
      });
      res.json(activity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Add a Sub-Activity
router.post('/teams/:teamId/activities/:activityId/sub-activities', async (req, res) => {
  const { activityId } = req.params;
  const { name } = req.body;
  try {
      const subActivity = await prisma.Subkegiatan.create({
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
router.put('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId', async (req, res) => {
  const { subActivityId } = req.params;
  const { name } = req.body;
  try {
      const subActivity = await prisma.Subkegiatan.update({
          where: { id: parseInt(subActivityId) },
          data: { name }
      });
      res.json(subActivity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a Sub-Activity
router.delete('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId', async (req, res) => {
  const { subActivityId } = req.params;
  try {
      const subActivity = await prisma.Subkegiatan.delete({
          where: { id: parseInt(subActivityId) }
      });
      res.json(subActivity);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Add a Task
router.post('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks', async (req, res) => {
  const { subActivityId } = req.params;
  const { name, dueDate, link, dateCreated } = req.body;
  try {
      const task = await prisma.Tugas.create({
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
router.put('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { name } = req.body;
  try {
      const task = await prisma.Tugas.update({
          where: { id: parseInt(taskId) },
          data: { name }
      });
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a Task
router.delete('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
      const task = await prisma.Tugas.delete({
          where: { id: parseInt(taskId) }
      });
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Toggle Task Completion
router.patch('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/completion', async (req, res) => {
  const { taskId } = req.params;
  try {
      const task = await prisma.Tugas.findUnique({ where: { id: parseInt(taskId) } });
      if (task) {
          const updatedTask = await prisma.task.update({
              where: { id: parseInt(taskId) },
              data: { completed: !task.completed }
          });
          res.json(updatedTask);
      } else {
          res.status(404).json({ error: 'Task not found' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Handle Deadline Change
router.patch('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/deadline', async (req, res) => {
  const { taskId } = req.params;
  const { newDeadline } = req.body;
  try {
      const task = await prisma.Tugas.update({
          where: { id: parseInt(taskId) },
          data: { dueDate: new Date(newDeadline) }
      });
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
      const task = await prisma.Tugas.update({
          where: { id: parseInt(taskId) },
          data: { driveLink: newLink }
      });
      res.json(task);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
