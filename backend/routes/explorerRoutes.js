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
      tanggal_pelaksanaan: activity.tanggal_pelaksanaan,
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
// [
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
//                               "dateUpload": "",
//                               "link": "#",
//                               "completed": true
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
//           }
//       ],
//       "links": []
//   }
// ]

// get all Team
router.get('/teams/v2', async (req, res) => {
  try {
    const timkerja = await timkerjaService.getAllTimkerja();
    res.json(timkerja);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// [
//   {
//       "id": 1,
//       "name": "IPDS",
//       "links": null,
//       "leader_id": null
//   }
// ]

// add team
router.post('/teams', async (req, res) => {
  try {
    const team = await timkerjaService.createTimkerja(req.body);
    res.status(201).json(team);
  } catch (error) {
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

router.patch('/teams/:id', async (req, res) => {
  try {
    const team = await timkerjaService.updateTimkerja(req.params.id, req.body);
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

router.delete('/teams/:id', async (req, res) => {
  try {
    const team = await timkerjaService.deleteTimkerja(req.params.id);
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

// resp [
//   {
//       "id": 1,
//       "tanggal_pelaksanaan": "2024-08-26T03:49:57.116Z",
//       "timkerja_id": 1,
//       "name": "pengolahan sp 2022"
//   }
// ]


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

// Add an Activity V2
router.post('/teams/:teamId/activities/v2', async (req, res) => {
  const { teamId } = req.params;
  const { name, tanggal_pelaksanaan } = req.body;
  try {
    const activity = await kegiatanService.createKegiatan({
      name,
      timkerja_id: parseInt(teamId),
      tanggal_pelaksanaan: tanggal_pelaksanaan ? new Date(tanggal_pelaksanaan) : new Date() // Inline default date
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

// resp with default date.now{
//   "id": 3,
//   "tanggal_pelaksanaan": "2024-08-26T04:59:50.775Z",
//   "timkerja_id": 1,
//   "name": "pengolahan KSA 2023"
// }

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

// resp {
//   "id": 3,
//   "tanggal_pelaksanaan": "2024-08-26T04:59:50.775Z",
//   "timkerja_id": 1,
//   "name": "pengolahan KSA"
// }

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

// [
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

// req {
//   "name":"persiapan organik KSA 2023"
// }
// resp {
//   "id": 2,
//   "tanggal_pelaksanaan": "2024-08-26T04:59:50.775Z",
//   "kegiatan_id": 3,
//   "name": "persiapan organik KSA 2023"
// }

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

// req {
//   "name":"persiapan mitra pengolahan KSA 2023"
// }
// resp {
//   "id": 3,
//   "tanggal_pelaksanaan": "2024-08-26T05:05:51.199Z",
//   "kegiatan_id": 4,
//   "name": "persiapan mitra pengolahan KSA 2023"
// }

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

// resp {
//   "id": 3,
//   "tanggal_pelaksanaan": "2024-08-26T05:05:51.199Z",
//   "kegiatan_id": 4,
//   "name": "persiapan mitra pengolahan KSA 2023"
// }

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
  const { name, dueDate, dateCreated, link } = req.body;
  try {
    const task = await tugasService.createTugas({
      name,
      dateCreated: dateCreated? new Date(dateCreated): new Date(),
      dueDate: new Date(dueDate),
      link,
      subkegiatan_id: parseInt(subActivityId)
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// req {
//   "name":"cek kesiapan device",
//   "dueDate":"2024-09-01",
//   "dateCreated":"",
//   "link":""
// }
// req v2 {
//   "name":"cek kesiapan tempat",
//   "dueDate":"2024-09-02"
// }

// resp {
//   "id": 3,
//   "subkegiatan_id": 2,
//   "name": "cek kesiapan device",
//   "dateCreated": "2024-08-26T05:12:22.357Z",
//   "dueDate": "2024-09-01T00:00:00.000Z",
//   "dateUpload": null,
//   "link": "",
//   "completed": false
// }
// resp v2 {
//   "id": 4,
//   "subkegiatan_id": 2,
//   "name": "cek kesiapan tempat",
//   "dateCreated": "2024-08-26T05:13:35.816Z",
//   "dueDate": "2024-09-02T00:00:00.000Z",
//   "dateUpload": null,
//   "link": null,
//   "completed": false
// }

// update 
router.patch('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { name, newDeadline, newLink, toggleCompletion } = req.body;

  try {
    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (newDeadline !== undefined) updateData.dueDate = new Date(newDeadline);
    if (newLink !== undefined){
      updateData.link = newLink;
      updateData.dateUpload = new Date();
    } ;

    // Apply updates if there is any data to update
    if (Object.keys(updateData).length > 0) {
      const updatedTask = await tugasService.updateTugas(taskId, updateData);
      res.json(updatedTask);
    }

    // Toggle completion status if requested
    if (toggleCompletion !== undefined) {
      const toggledTask = await tugasService.toggleTugasCompletion(taskId);
      res.json(toggledledTask);
    } else if (Object.keys(updateData).length === 0 && toggleCompletion === undefined) {
      res.status(400).json({ error: 'No valid fields to update' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.delete('/teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await tugasService.deleteTugas(taskId);
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


export default router;
