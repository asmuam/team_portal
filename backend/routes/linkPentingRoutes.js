import express from 'express';
import * as linkPentingService from '../services/linkPentingService.js'; // Sesuaikan dengan path

const router = express.Router();

// Add a link to a team
router.post('/teams/:teamId/links', async (req, res) => {
  const { teamId } = req.params;
  const { url, description } = req.body;

  if (!url || !description) {
    return res.status(400).json({ error: 'URL and description are required' });
  }

  const link = { id: Date.now(), url, description };

  try {
    const updatedTeam = await linkPentingService.addLinkToTeam(teamId, link);
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a link from a team
router.delete('/teams/:teamId/links/:linkId', async (req, res) => {
  const { teamId, linkId } = req.params;

  try {
    const updatedTeam = await linkPentingService.deleteLinkFromTeam(teamId, parseInt(linkId));
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit a link in a team
router.patch('/teams/:teamId/links/:linkId', async (req, res) => {
  const { teamId, linkId } = req.params;
  const { url, description } = req.body;

  if (!url || !description) {
    return res.status(400).json({ error: 'URL and description are required' });
  }

  const newLink = { url, description };

  try {
    const updatedTeam = await linkPentingService.editLinkInTeam(teamId, parseInt(linkId), newLink);
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
