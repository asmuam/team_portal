import prisma from '../prisma/config.js'; // Sesuaikan dengan path dan format ESM

//linkPentingService.js

// get all links
export const getAllLinkToTeam = async (teamId) => {
  return prisma.timkerja.findUnique({
    where: { id: parseInt(teamId) },
    select: { links: true }, // Select only the 'links' field
  });
};


// Function to add a link to a team
export const addLinkToTeam = async (teamId, link) => {
  try {
    // Fetch the current links
    const team = await prisma.timkerja.findUnique({
      where: { id: parseInt(teamId) },
      select: { links: true } // Only fetch the links field
    });

    // Check if the team exists
    if (!team) {
      throw new Error('Team not found');
    }

    // Ensure links is an array
    const currentLinks = Array.isArray(team.links) ? team.links : [];

    // Add the new link to the array
    const updatedLinks = [...currentLinks, link];

    // Update the team with the new links array
    return await prisma.timkerja.update({
      where: { id: parseInt(teamId) },
      data: { links: updatedLinks }
    });
  } catch (error) {
    console.error('Error adding link to team:', error.message);
    throw new Error('Failed to add link');
  }
};

// Function to delete a link from a team
export const deleteLinkFromTeam = async (teamId, linkId) => {
  try {
    // Fetch the team and its links
    const team = await prisma.timkerja.findUnique({
      where: { id: parseInt(teamId) },
      select: { links: true } // Only fetch the links field
    });

    // Check if the team exists
    if (!team) {
      throw new Error('Team not found');
    }

    // Ensure links is an array, default to empty array if not
    const links = Array.isArray(team.links) ? team.links : [];

    // Filter out the link to be deleted
    const updatedLinks = links.filter(link => link.id !== linkId);

    // Update the team with the new links array
    return await prisma.timkerja.update({
      where: { id: parseInt(teamId) },
      data: { links: updatedLinks }
    });
  } catch (error) {
    console.error('Error deleting link from team:', error.message);
    throw new Error('Failed to delete link');
  }
};


// Function to edit a link in a team
export const editLinkInTeam = async (teamId, linkId, newLink) => {
  try {
    // Fetch the current team and its links
    const team = await prisma.timkerja.findUnique({
      where: { id: parseInt(teamId) }
    });

    if (!team) {
      throw new Error('Team not found');
    }

    // Ensure links is an array
    const currentLinks = Array.isArray(team.links) ? team.links : [];

    // Update the specific link if it exists
    const updatedLinks = currentLinks.map(link =>
      link.id === linkId ? { ...link, ...newLink } : link
    );

    // Update the team with the new links array
    return await prisma.timkerja.update({
      where: { id: parseInt(teamId) },
      data: { links: updatedLinks }
    });
  } catch (error) {
    console.error('Error editing link in team:', error.message);
    throw new Error('Failed to edit link');
  }
};
