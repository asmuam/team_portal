import express from "express";
import prisma from "../prisma/config.js"; // Sesuaikan dengan path dan format ESM
import * as timkerjaService from "../services/timKerjaService.js";
import * as kegiatanService from "../services/kegiatanService.js";
import * as subkegiatanService from "../services/subkegiatanService.js";
import * as tugasService from "../services/tugasService.js";

const router = express.Router();

// full direct
router.get("/teams", async (req, res) => {
  try {
    const teams = await getTeams();
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    activities: team.kegiatan.map((activity) => ({
      id: activity.id,
      name: activity.name,
      tanggal_pelaksanaan: activity.tanggal_pelaksanaan,
      subActivities: activity.subkegiatan.map((subActivity) => ({
        id: subActivity.id,
        name: subActivity.name,
        tasks: subActivity.tugas.map((task) => ({
          id: task.id,
          name: task.name,
          dateCreated: task.dateCreated.toISOString().split("T")[0],
          dueDate: task.dueDate.toISOString().split("T")[0],
          dateUpload: task.dateUpload ? task.dateUpload.toISOString().split("T")[0] : "",
          link: task.link || "",
          completed: task.completed,
        })),
      })),
    })),
    links: team.links || [],
  }));
};
// get all Team
router.get("/teams/v2", async (req, res) => {
  try {
    const timkerja = await timkerjaService.getAllTimkerja();
    res.json(timkerja);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// add team
router.post("/teams", async (req, res) => {
  try {
    const team = await timkerjaService.createTimkerja(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/teams/:id", async (req, res) => {
  try {
    const team = await timkerjaService.updateTimkerja(req.params.id, req.body);
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/teams/:id", async (req, res) => {
  try {
    const team = await timkerjaService.deleteTimkerja(req.params.id);
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/teams/:teamId/activities", async (req, res) => {
  try {
    const { teamId } = req.params;
    const activities = await kegiatanService.getKegiatanByTeamId(teamId);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add an Activity
router.post("/teams/:teamId/activities", async (req, res) => {
  const { teamId } = req.params;
  const { name, tanggal_pelaksanaan } = req.body;
  try {
    const activity = await kegiatanService.createKegiatan({
      name,
      tanggal_pelaksanaan: tanggal_pelaksanaan ? new Date(tanggal_pelaksanaan) : new Date(), // Inline default date
      timkerja_id: parseInt(teamId),
    });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add an Activity V2 (with tanggal_pelaksanaan)
router.post("/teams/:teamId/activities/v2", async (req, res) => {
  const { teamId } = req.params;
  const { name, tanggal_pelaksanaan } = req.body;
  try {
    const activity = await kegiatanService.createKegiatan({
      name,
      timkerja_id: parseInt(teamId),
      tanggal_pelaksanaan: tanggal_pelaksanaan ? new Date(tanggal_pelaksanaan) : new Date(), // Inline default date
    });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit an Activity (with tanggal_pelaksanaan)
router.patch("/teams/:teamId/activities/:activityId", async (req, res) => {
  const { activityId } = req.params;
  const { name, tanggal_pelaksanaan } = req.body;
  try {
    const updatedFields = { name };
    if (tanggal_pelaksanaan) {
      updatedFields.tanggal_pelaksanaan = new Date(tanggal_pelaksanaan);
    }
    const activity = await kegiatanService.updateKegiatan(activityId, updatedFields);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an Activity
router.delete("/teams/:teamId/activities/:activityId", async (req, res) => {
  const { activityId } = req.params;
  try {
    const activity = await kegiatanService.deleteKegiatan(activityId);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Sub-Activities by Activity ID
router.get("/teams/:teamId/activities/:activityId/sub-activities", async (req, res) => {
  try {
    const { activityId } = req.params;
    const subActivities = await subkegiatanService.getSubkegiatanByActivityId(activityId);
    res.json(subActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/teams/:teamId/activities/:activityId/sub-activities", async (req, res) => {
  const { activityId } = req.params;
  const { name, tanggal_pelaksanaan } = req.body; // Tambahkan tanggal_pelaksanaan
  try {
    const subActivity = await subkegiatanService.createSubkegiatan({
      name,
      tanggal_pelaksanaan, // Tambahkan tanggal_pelaksanaan
      kegiatan_id: parseInt(activityId),
    });
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename a Sub-Activity
router.patch("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId", async (req, res) => {
  const { subActivityId } = req.params;
  const { name, tanggal_pelaksanaan } = req.body; // Tambahkan tanggal_pelaksanaan
  try {
    const subActivity = await subkegiatanService.updateSubkegiatan(subActivityId, {
      name,
      tanggal_pelaksanaan, // Tambahkan tanggal_pelaksanaan
    });
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete a Sub-Activity
router.delete("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId", async (req, res) => {
  const { subActivityId } = req.params;
  try {
    const subActivity = await subkegiatanService.deleteSubkegiatan(subActivityId);
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks for a specific sub-activity
router.get("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks", async (req, res) => {
  const { subActivityId } = req.params;
  try {
    const tasks = await tugasService.getTugasBySubkegiatanId(subActivityId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a Task
router.post("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks", async (req, res) => {
  const { subActivityId } = req.params;
  const { name, dueDate, dateCreated, link } = req.body;
  try {
    const task = await tugasService.createTugas({
      name,
      dateCreated: dateCreated ? new Date(dateCreated) : new Date(),
      dueDate: new Date(dueDate),
      link,
      subkegiatan_id: parseInt(subActivityId),
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update
router.patch("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { name, dueDate, link, toggleCompletion } = req.body; // Menggunakan nama parameter yang konsisten

  try {
    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate); // Menggunakan dueDate yang benar
    if (link !== undefined) {
      updateData.link = link;
      updateData.dateUpload = new Date();
    }

    // Apply updates if there is any data to update
    if (Object.keys(updateData).length > 0) {
      const updatedTask = await tugasService.updateTugas(taskId, updateData);
      res.json(updatedTask);
    }

    // Toggle completion status if requested
    if (toggleCompletion !== undefined) {
      const toggledTask = await tugasService.toggleTugasCompletion(taskId);
      res.json(toggledTask);
    } else if (Object.keys(updateData).length === 0 && toggleCompletion === undefined) {
      res.status(400).json({ error: "No valid fields to update" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Task
router.delete("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await tugasService.deleteTugas(taskId);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle Task Completion
router.patch("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/completion", async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await tugasService.toggleTugasCompletion(taskId);
    res.json(task);
  } catch (error) {
    console.error("Error updating task completion:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
