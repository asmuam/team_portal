import React, { useState } from 'react';
import './LinkPenting.css'; // Ensure to import your CSS file

const LinkPenting = ({ data }) => {
  const [teams, setTeams] = useState(data);
  const [openTeam, setOpenTeam] = useState(null);

  const handleToggleTeam = (teamId) => {
    setOpenTeam(openTeam === teamId ? null : teamId);
  };

  const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `http://${url}`;
    }
    return url;
  };

  const handleAddLink = (teamId) => {
    const url = prompt('Enter the link URL:');
    const description = prompt('Enter the Description:');
    if (url && description) {
      const formattedUrl = formatUrl(url);
      const link = { id: Date.now(), url: formattedUrl, description };
      setTeams(teams.map(team =>
        team.id === teamId ? { ...team, links: [...team.links, link] } : team
      ));
    }
  };

  const handleDeleteLink = (teamId, linkId) => {
    setTeams(teams.map(team =>
      team.id === teamId ? { ...team, links: team.links.filter(link => link.id !== linkId) } : team
    ));
  };

  const handleEditLink = (teamId, linkId) => {
    const team = teams.find(team => team.id === teamId);
    const link = team.links.find(link => link.id === linkId);
    const newUrl = prompt('Edit the link URL:', link.url);
    const newDescription = prompt('Edit the short description:', link.description);
    
    if (newUrl && newDescription) {
      const formattedUrl = formatUrl(newUrl);
      const updatedLink = {
        ...link,
        url: formattedUrl,
        description: newDescription,
      };
      
      setTeams(teams.map(team =>
        team.id === teamId
          ? { ...team, links: team.links.map(link => link.id === linkId ? updatedLink : link) }
          : team
      ));
    }
  };

  return (
    <div className="teams-container">
      {teams.map(team => (
        <div key={team.id} className="team-item">
          <button className="team-toggle-button" onClick={() => handleToggleTeam(team.id)}>
            {openTeam === team.id ? '⮟' : '⮞'} {team.name}
          </button>
          {openTeam === team.id && (
            <div className="links-container">
              {team.links.map(link => (
                <div key={link.id} className="link-item">
                  <div className="link-info">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-url"
                    >
                      {link.url}
                    </a>
                    <div className="link-description">
                      <span>{link.description}</span>
                      <span
                        className="info-icon"
                        title={link.description}
                      >
                        ℹ️
                      </span>
                    </div>
                  </div>
                  <div className="link-actions">
                  <span
                      onClick={() => handleEditLink(team.id, link.id)}
                      className="edit-icon"
                    >
                    &#9998;
                    </span>                    <span
                      onClick={() => handleDeleteLink(team.id, link.id)}
                      className="delete-icon"
                    >
                    &#10006;
                    </span>
                  </div>
                </div>
              ))}
              <button onClick={() => handleAddLink(team.id)}>Add Another Link</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LinkPenting;
