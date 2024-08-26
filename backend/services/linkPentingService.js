import prisma from '../prisma/config.js'; // Sesuaikan dengan path dan format ESM

//linkPentingService.js

// Add a link to a team
export const addLinkToTeam = async (teamId, link) => {
  return prisma.timkerja.update({
    where: { id: parseInt(teamId) },
    data: {
      links: {
        push: link
      }
    }
  });
};

// Delete a link from a team
export const deleteLinkFromTeam = async (teamId, linkId) => {
  const team = await prisma.timkerja.findUnique({
    where: { id: parseInt(teamId) }
  });

  const updatedLinks = team.links.filter(link => link.id !== linkId);

  return prisma.timkerja.update({
    where: { id: parseInt(teamId) },
    data: { links: updatedLinks }
  });
};

// Edit a link in a team
export const editLinkInTeam = async (teamId, linkId, newLink) => {
  const team = await prisma.timkerja.findUnique({
    where: { id: parseInt(teamId) }
  });

  const updatedLinks = team.links.map(link =>
    link.id === linkId ? { ...link, ...newLink } : link
  );

  return prisma.timkerja.update({
    where: { id: parseInt(teamId) },
    data: { links: updatedLinks }
  });
};
