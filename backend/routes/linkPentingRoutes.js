import express, { response } from "express";
import * as linkPentingService from "../services/linkPentingService.js"; // Sesuaikan dengan path

const router = express.Router();

// get all link from a team
router.get("/teams/:teamId/links", async (req, res) => {
  const { teamId } = req.params;

  try {
    const linksTeam = await linkPentingService.getAllLinkToTeam(teamId);
    res.json(linksTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// {
//   "links": [
//       {
//           "id": 1724654823312,
//           "url": "bps.go.xx",
//           "description": "klaten"
//       }
//   ]
// }

// Add a link to a team
router.post("/teams/:teamId/links", async (req, res) => {
  const { teamId } = req.params;
  const { url, description } = req.body;

  if (!url || !description) {
    return res.status(400).json({ error: "URL and description are required" });
  }

  const link = { id: Date.now(), url, description };

  try {
    const updatedTeam = await linkPentingService.addLinkToTeam(teamId, link);
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// req {
//   "url":"ZI.byl.bps.go.id",
//   "description":"akses dengan vpn web zi byl bps"
//   }
// resp {
//   "id": 3,
//   "name": "ZI",
//   "links": [
//       {
//           "id": 1724654145007,
//           "url": "bps.go.com",
//           "description": "bps"
//       },
//       {
//           "id": 1724812162450,
//           "url": "ZI.byl.bps.go.id",
//           "description": "akses dengan vpn web zi byl bps"
//       },
//       {
//           "id": 1724812216918,
//           "url": "ZI.byl.bps.go.id",
//           "description": "akses dengan vpn web zi byl bps"
//       }
//   ],
//   "leader_id": null
// }

// Delete a link from a team
router.delete("/teams/:teamId/links/:linkId", async (req, res) => {
  const { teamId, linkId } = req.params;

  try {
    const updatedTeam = await linkPentingService.deleteLinkFromTeam(teamId, parseInt(linkId));
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// {
//   "id": 3,
//   "name": "ZI",
//   "links": [
//       {
//           "id": 1724654145007,
//           "url": "bps.go.com",
//           "description": "bps"
//       },
//       {
//           "id": 1724812162450,
//           "url": "ZI.byl.bps.go.id",
//           "description": "akses dengan vpn web zi byl bps"
//       }
//   ],
//   "leader_id": null
// }

// Edit a link in a team
router.patch("/teams/:teamId/links/:linkId", async (req, res) => {
  const { teamId, linkId } = req.params;
  const { url, description } = req.body;

  // Create a new link object only with provided fields
  const newLink = {};
  if (url) newLink.url = url;
  if (description) newLink.description = description;

  if (Object.keys(newLink).length === 0) {
    return res.status(400).json({ error: "At least one field (url or description) is required to update" });
  }

  try {
    const updatedTeam = await linkPentingService.editLinkInTeam(teamId, parseInt(linkId), newLink);
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// req {
//   "url":"edited url"}
// resp {
//   "id": 3,
//   "name": "ZI",
//   "links": [
//       {
//           "id": 1724654145007,
//           "url": "edited url",
//           "description": "bps"
//       },
//       {
//           "id": 1724812162450,
//           "url": "ZI.byl.bps.go.id",
//           "description": "akses dengan vpn web zi byl bps"
//       },
//       {
//           "id": 1724812216918,
//           "url": "ZI.byl.bps.go.id",
//           "description": "akses dengan vpn web zi byl bps"
//       }
//   ],
//   "leader_id": null
// }

// req {
//   "description":"edited description"}
// resp {
//   "id": 3,
//   "name": "ZI",
//   "links": [
//       {
//           "id": 1724654145007,
//           "url": "edited url",
//           "description": "edited desc"
//       },
//       {
//           "id": 1724812162450,
//           "url": "ZI.byl.bps.go.id",
//           "description": "akses dengan vpn web zi byl bps"
//       },
//       {
//           "id": 1724812216918,
//           "url": "ZI.byl.bps.go.id",
//           "description": "akses dengan vpn web zi byl bps"
//       }
//   ],
//   "leader_id": null
// }
export default router;
