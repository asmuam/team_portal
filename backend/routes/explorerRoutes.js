import express from "express";
import prisma from "../prisma/config.js"; // Sesuaikan dengan path dan format ESM
import * as timkerjaService from "../services/timKerjaService.js";
import * as kegiatanService from "../services/kegiatanService.js";
import * as subkegiatanService from "../services/subkegiatanService.js";
import * as tugasService from "../services/tugasService.js";
import { createFolder, extractFolderIdFromUrl, deleteFolder, renameFolder } from "../utils/googleDriveUtils.js";
import { authorizeRole } from "../middleware/authMiddleware.js"; // Sesuaikan dengan path authMiddleware.js

const router = express.Router();

// full direct
router.get("/allData", async (req, res) => {
  try {
    const teams = await getAllData();
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const getAllData = async () => {
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

// resp [
//   {
//       "id": 1,
//       "name": "IPDS",
//       "activities": [
//           {
//               "id": 1,
//               "name": "pengolahan sp 2022",
//               "tanggal_pelaksanaan": "2024-08-26T03:49:57.116Z",
//               "subActivities": [
//                   {
//                       "id": 1,
//                       "name": "kj",
//                       "tasks": [
//                           {
//                               "id": 1,
//                               "name": "kk",
//                               "dateCreated": "2024-08-26",
//                               "dueDate": "2024-11-11",
//                               "dateUpload": "2024-08-28",
//                               "link": "bps.go.id",
//                               "completed": false
//                           },
//                           {
//                               "id": 2,
//                               "name": "jnjnj",
//                               "dateCreated": "2024-08-26",
//                               "dueDate": "2020-11-11",
//                               "dateUpload": "",
//                               "link": "#",
//                               "completed": false
//                           }
//                       ]
//                   }
//               ]
//           },
//           {
//               "id": 2,
//               "name": "pengolahan ST2023",
//               "tanggal_pelaksanaan": "2024-08-09T00:00:00.000Z",
//               "subActivities": []
//           },
//           {
//               "id": 4,
//               "name": "pengolahan KSA 2023",
//               "tanggal_pelaksanaan": "2024-08-26T05:02:12.557Z",
//               "subActivities": [
//                   {
//                       "id": 2,
//                       "name": "persiapan organik KSA 2023",
//                       "tasks": [
//                           {
//                               "id": 4,
//                               "name": "cek kesiapan tempat",
//                               "dateCreated": "2024-08-26",
//                               "dueDate": "2024-09-19",
//                               "dateUpload": "2024-08-26",
//                               "link": "bps.go.id",
//                               "completed": true
//                           }
//                       ]
//                   }
//               ]
//           },
//           {
//               "id": 5,
//               "name": "cek",
//               "tanggal_pelaksanaan": "2001-12-01T00:00:00.000Z",
//               "subActivities": [
//                   {
//                       "id": 4,
//                       "name": "Pencacahan",
//                       "tasks": []
//                   },
//                   {
//                       "id": 5,
//                       "name": "Pelatihan",
//                       "tasks": []
//                   }
//               ]
//           }
//       ],
//       "links": [
//           {
//               "id": 1724654823312,
//               "url": "bps.go.xx",
//               "description": "klaten"
//           }
//       ]
//   },
//   {
//       "id": 3,
//       "name": "ZI",
//       "activities": [],
//       "links": [
//           {
//               "id": 1724654145007,
//               "url": "bps.go.com",
//               "description": "bps"
//           }
//       ]
//   }
// ]

// get all Team

router.get("/teams", async (req, res) => {
  try {
    const timkerja = await timkerjaService.getAllTimkerja();
    res.json(timkerja);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/teams/:id", async (req, res) => {
  try {
    const timkerja = await timkerjaService.getTimkerjaById(req.params.id);
    res.json(timkerja);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// [
//   {
//       "id": 1,
//       "name": "IPDS",
//       "links": [],
//       "leader_id": 2,
//       "leader": {
//             "id": 2,
//             "name": "Himawan Wahid Ikhwansyah"
//                }
//   },
//   {
//       "id": 3,
//       "name": "ZI",
//       "links": [
//           {
//               "id": 1724654145007,
//               "url": "edited url",
//               "description": "edited desc"
//           },
//           {
//               "id": 1724812162450,
//               "url": "ZI.byl.bps.go.id",
//               "description": "akses dengan vpn web zi byl bps"
//           },
//           {
//               "id": 1724812216918,
//               "url": "ZI.byl.bps.go.id",
//               "description": "akses dengan vpn web zi byl bps"
//           }
//       ],
//       "leader_id": 2,
//       "leader": {
//             "id": 2,
//             "name": "Himawan Wahid Ikhwansyah"
//                }
//   },
//   {
//       "id": 5,
//       "name": "tim kerja 88",
//       "links": null,
//       "leader_id": 2,
//       "leader": {
//             "id": 2,
//             "name": "Himawan Wahid Ikhwansyah"
//                }
//   }
// ]

// add team
router.post("/teams", authorizeRole(["admin"]), async (req, res) => {
  try {
    const team = await timkerjaService.createTimkerja(req.body);
    res.status(201).json(team);
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).json({ error: error.message });
  }
});

// req {
//   "name":"tim kerja 88"
// }

// resp {
//   "id": 2,
//   "name": "tim kerja 88",
//   "links": null,
//   "leader_id": null
// }

router.patch("/teams/:id", authorizeRole(["admin"]), async (req, res) => {
  try {
    // Fetch the current team data
    const team = await timkerjaService.getTimkerjaById(req.params.id);

    // Check if name is provided and link_drive exists
    if (req.body.name && team.link_drive) {
      const existingTeam = await prisma.timkerja.findUnique({
        where: {
          leader_id: req.body.leader_id,
        },
      });
    
      if (existingTeam) {
        throw new Error('A team with this leader_id already exists.');
      }
      // Rename the folder
      await renameFolder(extractFolderIdFromUrl(team.link_drive), req.body.name);
    }

    // Update the team data
    const updatedTeam = await timkerjaService.updateTimkerja(req.params.id, req.body);

    // Send response with the updated team data
    res.json(updatedTeam);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});


// req {
//   "name":"tim kerja 99"
// }

// resp {
//   "id": 2,
//   "name": "tim kerja 99",
//   "links": null,
//   "leader_id": null
// }

router.delete("/teams/:id", authorizeRole(["admin"]), async (req, res) => {
  try {
    const team = await timkerjaService.deleteTimkerja(req.params.id);
    await deleteFolder(extractFolderIdFromUrl(team.link_drive))
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// req {
//   "name":"tim kerja 99"
// }

// resp {
//   "id": 2,
//   "name": "tim kerja 99",
//   "links": null,
//   "leader_id": null
// }

//archive team soon

router.get("/teams/:teamId/activities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await kegiatanService.getKegiatanById(id);
    res.json(activity);
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

// resp [
//   {
//       "id": 1,
//       "tanggal_pelaksanaan": "2024-08-26T03:49:57.116Z",
//       "timkerja_id": 1,
//       "name": "pengolahan sp 2022"
//   }
// ]

// Add an Activity
router.post("/teams/:teamId/activities", async (req, res) => {
  const { teamId } = req.params;
  const { name, tanggal_pelaksanaan, deskripsi } = req.body;
  try {
    const result = await prisma.timkerja.findMany({
      where: {
        id: parseInt(teamId), // Filter by teamId
      },
      select: {
        link_drive: true, // Select only the link_drive column
      },
    });

    const link_drive = await createFolder(req.body.name, extractFolderIdFromUrl(result[0].link_drive));
    const activity = await kegiatanService.createKegiatan({
      name,
      deskripsi,
      tanggal_pelaksanaan: tanggal_pelaksanaan ? new Date(tanggal_pelaksanaan) : new Date(), // Inline default date
      timkerja_id: parseInt(teamId),
      link_drive,
    });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// req yyyy-mm-dd{
//   "name":"pengolahan ST2023",
//   "tanggal_pelaksanaan":"2024-08-09"
// }

// resp {
//   "id": 2,
//   "tanggal_pelaksanaan": "2024-08-09T00:00:00.000Z",
//   "timkerja_id": 1,
//   "name": "pengolahan ST2023"
// }

// resp with default date.now{
//   "id": 3,
//   "tanggal_pelaksanaan": "2024-08-26T04:59:50.775Z",
//   "timkerja_id": 1,
//   "name": "pengolahan KSA"
// }

// Edit an Activity (with tanggal_pelaksanaan)
router.patch("/teams/:teamId/activities/:activityId", async (req, res) => {
  const { activityId } = req.params;
  const { name, tanggal_pelaksanaan, deskripsi } = req.body;
  try {
    const updatedFields = {};
    if (name) {
      updatedFields.name = name;
      const activity = await kegiatanService.getKegiatanById(activityId);

      // Check if name is provided and link_drive exists
      if (activity.link_drive) {
        // Rename the folder
        await renameFolder(extractFolderIdFromUrl(activity.link_drive), name);
      }
    }
    if (deskripsi) {
      updatedFields.deskripsi = deskripsi;
    }
    if (tanggal_pelaksanaan) {
      updatedFields.tanggal_pelaksanaan = new Date(tanggal_pelaksanaan);
    }
    const activity = await kegiatanService.updateKegiatan(activityId, updatedFields);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// req {
//   "tanggal_pelaksanaan":"2024-08-09"
//   }
// resp {
//   "id": 7,
//   "tanggal_pelaksanaan": "2024-08-09T00:00:00.000Z",
//   "timkerja_id": 1,
//   "name": "kegiatan 989"
// }
// req {
//   "name":"kegiatan 989"
//   }
// resp {
//   "id": 7,
//   "tanggal_pelaksanaan": "2024-01-01T00:00:00.000Z",
//   "timkerja_id": 1,
//   "name": "kegiatan 989"
// }

// Delete an Activity
router.delete("/teams/:teamId/activities/:activityId", async (req, res) => {
  const { activityId } = req.params;
  try {
    const activity = await kegiatanService.deleteKegiatan(activityId);
    await deleteFolder(extractFolderIdFromUrl(activity.link_drive))
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// resp {
//   "id": 7,
//   "tanggal_pelaksanaan": "2024-08-09T00:00:00.000Z",
//   "timkerja_id": 1,
//   "name": "kegiatan 989"
// }


router.get("/teams/:teamId/activities/:activityId/sub-activities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subActivity = await subkegiatanService.getSubkegiatanById(id);
    res.json(subActivity);
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

// resp [
//   {
//       "id": 2,
//       "tanggal_pelaksanaan": "2024-08-26T05:04:32.718Z",
//       "kegiatan_id": 4,
//       "name": "persiapan organik KSA 2023"
//   },
//   {
//       "id": 3,
//       "tanggal_pelaksanaan": "2024-08-26T05:05:51.199Z",
//       "kegiatan_id": 4,
//       "name": "persiapan mitra KSA 2023"
//   }
// ]

router.post("/teams/:teamId/activities/:activityId/sub-activities", async (req, res) => {
  const { activityId } = req.params;
  const { name, tanggal_pelaksanaan, deskripsi } = req.body; // Tambahkan tanggal_pelaksanaan
  try {
    const result = await prisma.kegiatan.findMany({
      where: {
        id: parseInt(activityId), // Filter by teamId
      },
      select: {
        link_drive: true, // Select only the link_drive column
      },
    });

    const link_drive = await createFolder(req.body.name, extractFolderIdFromUrl(result[0].link_drive));
    const subActivity = await subkegiatanService.createSubkegiatan({
      name,
      deskripsi,
      tanggal_pelaksanaan: tanggal_pelaksanaan ? new Date(tanggal_pelaksanaan) : new Date(), // Inline default date
      kegiatan_id: parseInt(activityId),
      link_drive,
    });
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// req {
//   "name":"sub-kegiatan 88",
//   "tanggal_pelaksanaan":"2024-09-09"
//   }
// resp {
//   "id": 6,
//   "tanggal_pelaksanaan": "2024-09-09T00:00:00.000Z",
//   "kegiatan_id": 5,
//   "name": "sub-kegiatan 88"
// }

// edit a Sub-Activity
router.patch("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId", async (req, res) => {
  const { subActivityId } = req.params;
  const { name, tanggal_pelaksanaan, deskripsi } = req.body; // Tambahkan tanggal_pelaksanaan
  try {
    const updatedFields = {};
    if (name) {
      updatedFields.name = name;
      const subActivity = await subkegiatanService.getSubkegiatanById(subActivityId);

      // Check if name is provided and link_drive exists
      if (subActivity.link_drive) {
        // Rename the folder
        await renameFolder(extractFolderIdFromUrl(subActivity.link_drive), name);
      }
    }
    if (deskripsi) {
      updatedFields.deskripsi = deskripsi;
    }
    if (tanggal_pelaksanaan) {
      updatedFields.tanggal_pelaksanaan = new Date(tanggal_pelaksanaan);
    }
    const subActivity = await subkegiatanService.updateSubkegiatan(subActivityId, updatedFields);
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// req {
//   "name":"sub-kegiatan 111"  }
// resp {
//   "id": 6,
//   "tanggal_pelaksanaan": "2000-09-09T00:00:00.000Z",
//   "kegiatan_id": 5,
//   "name": "sub-kegiatan 999"
// }

// req {
//   "tanggal_pelaksanaan":"1999-09-09"
//   }
// resp {
//   "id": 6,
//   "tanggal_pelaksanaan": "1999-09-09T00:00:00.000Z",
//   "kegiatan_id": 5,
//   "name": "sub-kegiatan 111"
// }

// Delete a Sub-Activity
router.delete("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId", async (req, res) => {
  const { subActivityId } = req.params;
  try {
    const subActivity = await subkegiatanService.deleteSubkegiatan(subActivityId);
    await deleteFolder(extractFolderIdFromUrl(subActivity.link_drive))
    res.json(subActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// resp {
//   "id": 6,
//   "tanggal_pelaksanaan": "2000-09-09T00:00:00.000Z",
//   "kegiatan_id": 5,
//   "name": "sub-kegiatan 999"
// }

// archive subkeg soon

router.get("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await tugasService.getTugasById(id);
    res.json(task);
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

// resp [
//   {
//       "id": 1,
//       "subkegiatan_id": 1,
//       "name": "kk",
//       "dateCreated": "2024-08-26T00:00:00.000Z",
//       "dueDate": "2024-11-11T00:00:00.000Z",
//       "dateUpload": "2024-08-28T00:22:48.859Z",
//       "link": "bps.go.id",
//       "completed": false
//   },
//   {
//       "id": 2,
//       "subkegiatan_id": 1,
//       "name": "jnjnj",
//       "dateCreated": "2024-08-26T00:00:00.000Z",
//       "dueDate": "2020-11-11T00:00:00.000Z",
//       "dateUpload": null,
//       "link": "#",
//       "completed": false
//   }
// ]

// Add a Task
router.post("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks", async (req, res) => {
  const { subActivityId } = req.params;
  const { name, dueDate, dateCreated, deskripsi, created_by } = req.body;
  
  try {
    // Step 1: Create the task without the link_drive
    const task = await tugasService.createTugas({
      name,
      dateCreated: dateCreated ? new Date(dateCreated) : new Date(),
      dueDate: new Date(dueDate),
      link: null, // Initially set link to null
      deskripsi,
      subkegiatan_id: parseInt(subActivityId),
      created_by,
    });

    // Step 2: Retrieve the link_drive and update the task
    const result = await prisma.subkegiatan.findUnique({
      where: {
        id: parseInt(subActivityId),
      },
      select: {
        link_drive: true,
      },
    });

    if (result && result.link_drive) {
      const folderName = `${created_by}_${name}`;
      const link_drive = await createFolder(folderName, extractFolderIdFromUrl(result.link_drive));
      
      // Update the task with the link_drive
      
      // Return the updated task
      const updatedTask = await tugasService.updateTugas(task.id, { link: link_drive });

      return res.json(updatedTask);
    } else {
      // If no link_drive is found, return the task without link
      return res.json(task);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// req {
//   "name": "task numero uno",
//   "dueDate": "2024-09-01",
//   "dateCreated": "",
//   "link": ""
// }

// resp {
//   "id": 5,
//   "subkegiatan_id": 1,
//   "name": "task numero uno",
//   "dateCreated": "2024-08-28T02:21:59.546Z",
//   "dueDate": "2024-09-01T00:00:00.000Z",
//   "dateUpload": null,
//   "link": "",
//   "completed": false
// }

// update
router.patch("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { name, dueDate, link, deskripsi } = req.body; // Fields to update

  try {
    // Prepare update data
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name;
      const task = await tugasService.getTugasById(taskId);
      const folderName = `${task.created_by}_${task.name}`;
      // Check if name is provided and link_drive exists
      if (task.link) {
        // Rename the folder
        await renameFolder(extractFolderIdFromUrl(task.link), folderName);
      }
    }
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate); // Ensure correct date format
    if (link !== undefined) {
      updateData.link = link;
      updateData.dateUpload = new Date(); // Assuming dateUpload is also updated with link
    }

    // Check if there are fields to update
    const hasUpdateData = Object.keys(updateData).length > 0;

    // Handle update
    if (hasUpdateData) {
      const updatedTask = await tugasService.updateTugas(taskId, updateData);
      return res.json(updatedTask); // Return after sending response
    }

    // Handle case where no valid fields are provided
    return res.status(400).json({ error: "No valid fields to update" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// req {
//   "name":"cek kesiapan device mitra"
//   }

// resp {
//   "id": 3,
//   "subkegiatan_id": 2,
//   "name": "cek kesiapan device mitra",
//   "dateCreated": "2024-08-26T05:12:22.357Z",
//   "dueDate": "2024-09-01T00:00:00.000Z",
//   "dateUpload": null,
//   "link": "",
//   "completed": false
// }

// req {
//   "newDeadline":"2024-09-19"
//   }
// resp {
//   "id": 4,
//   "subkegiatan_id": 2,
//   "name": "cek kesiapan tempat",
//   "dateCreated": "2024-08-26T05:13:35.816Z",
//   "dueDate": "2024-09-19T00:00:00.000Z",
//   "dateUpload": null,
//   "link": null,
//   "completed": true
// }

// req {
//   "newLink":"bps.go.id"
//   }
// resp {
//   "id": 4,
//   "subkegiatan_id": 2,
//   "name": "cek kesiapan tempat",
//   "dateCreated": "2024-08-26T05:13:35.816Z",
//   "dueDate": "2024-09-19T00:00:00.000Z",
//   "dateUpload": "2024-08-26T05:36:50.980Z",
//   "link": "bps.go.id",
//   "completed": true
// }

// Delete a Task
router.delete("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await tugasService.deleteTugas(taskId);
    await deleteFolder(extractFolderIdFromUrl(task.link))
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// resp {
//   "id": 3,
//   "subkegiatan_id": 2,
//   "name": "cek kesiapan device mitra",
//   "dateCreated": "2024-08-26T05:12:22.357Z",
//   "dueDate": "2024-09-01T00:00:00.000Z",
//   "dateUpload": null,
//   "link": "",
//   "completed": false
// }

// Toggle Task Completion
router.patch("/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId/completion", authorizeRole(["admin"]), async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await tugasService.toggleTugasCompletion(taskId);
    res.json(task);
  } catch (error) {
    console.error("Error updating task completion:", error);
    res.status(500).json({ error: error.message });
  }
});

// resp {
//   "id": 4,
//   "subkegiatan_id": 2,
//   "name": "cek kesiapan tempat",
//   "dateCreated": "2024-08-26T05:13:35.816Z",
//   "dueDate": "2024-09-02T00:00:00.000Z",
//   "dateUpload": null,
//   "link": null,
//   "completed": true
// }

// archive tugas soon

// Get all pegawai incl admins
router.get("/users/pegawai", async (req, res) => {
  try {
    const pegawai = await prisma.user.findMany({
      where: {
        role: {
          in: ["pegawai", "admin"], // Use 'in' to specify multiple roles
        },
      },
    });
    res.json(pegawai);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// resp [ belum di dokumentasikan
//   {
//       "id": 1,
//       "username": "adib",
//       "name": "Adib Sulthon Asmuamal",
//       "password": "$2a$12$d8xzHE5UOU8QgM4BE5G.YeOGDyXyu7mDeYxOvt620CQkuRHC4iugK",
//       "role": "pegawai",
//       "refresh_token": null
//   },
//   {
//       "id": 2,
//       "username": "hima",
//       "name": "Himawan Wahid Ikhwansyah",
//       "password": "$2a$12$d8xzHE5UOU8QgM4BE5G.YeOGDyXyu7mDeYxOvt620CQkuRHC4iugK",
//       "role": "pegawai",
//       "refresh_token": null
//   }
// ]

export default router;
