import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SongDetail.css';

const API_BASE_URL = 'https://localhost:7003/api';

function SongList() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State voor het filter
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'stijgers', 'dalers', 'nieuw'
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/songs`);
      if (!response.ok) throw new Error('Fout bij ophalen nummers');
      const data = await response.json();
      setSongs(data);
      setFilteredSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Functie om de lijst te filteren
  const handleFilter = (type) => {
    setActiveFilter(type);
    setShowFilterMenu(false); // Menu sluiten na keuze

    let result = [...songs];
    if (type === 'stijgers') {
      result = songs.filter(s => s.positionChange > 0);
    } else if (type === 'dalers') {
      result = songs.filter(s => s.positionChange < 0);
    } else if (type === 'nieuw') {
      result = songs.filter(s => !s.previousPosition); // Geen vorige positie = nieuw
    }
    setFilteredSongs(result);
  };

  if (loading) return <div className="loading">De lijst wordt geladen...</div>;

  return (
    <div className="song-list-container">
      
      {/* --- DE HEADER RIJ MET DE FILTER KNOP --- */}
      <div className="list-header-row">
        <div className="header-text">
          TOP 2000 2024 - <span className="highlight-text">Page 1 of 40</span> ({filteredSongs.length} songs)
        </div>

        <div className="filter-wrapper">
          <button 
            className={`filter-btn ${activeFilter !== 'all' ? 'active' : ''}`}
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            {activeFilter === 'all' ? '🔍 Filter Lijst' : `Filter: ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
          </button>

          {showFilterMenu && (
            <div className="filter-dropdown">
              <button onClick={() => handleFilter('all')}>Alles tonen</button>
              <button onClick={() => handleFilter('stijgers')}>Stijgers (↑)</button>
              <button onClick={() => handleFilter('dalers')}>Dalers (↓)</button>
              <button onClick={() => handleFilter('nieuw')}>Nieuw (✨)</button>
            </div>
          )}
        </div>
      </div>
      {/* ---------------------------------------- */}

      {/* De Tabel */}
      <div className="table-container">
        <table className="song-table">
          <thead>
            <tr>
              <th style={{width: '60px'}}>POS</th>
              <th>TITEL</th>
              <th>ARTIEST</th>
              <th style={{width: '60px'}}>JAAR</th>
              <th style={{width: '80px'}}>VERSCHIL</th>
            </tr>
          </thead>
          <tbody>
            {filteredSongs.map((song) => (
              <tr key={song.id} onClick={() => navigate(`/song/${song.slug}`)}>
                <td className="pos-cell">#{song.currentPosition}</td>
                <td className="title-cell"><strong>{song.titel}</strong></td>
                <td>{song.artistName}</td>
                <td>{song.releaseYear}</td>
                <td className={`change-cell ${song.positionChange > 0 ? 'up' : song.positionChange < 0 ? 'down' : ''}`}>
                  {song.positionChange > 0 ? `↑ ${song.positionChange}` : 
                   song.positionChange < 0 ? `↓ ${Math.abs(song.positionChange)}` : '–'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SongList;