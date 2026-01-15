import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import './Statistics.css';

function Statistics() {
  const [droppedSongs, setDroppedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const navigate = useNavigate();

  // Generate years from 2000 to 2024 (need previous year data)
  const availableYears = [];
  for (let year = 2024; year >= 2000; year--) {
    availableYears.push(year);
  }

  useEffect(() => {
    fetchDroppedSongs();
  }, [selectedYear]);

  const fetchDroppedSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/songs/statistics/dropped-songs?year=${selectedYear}`;
      console.log('Fetching statistics from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        // Try to get error message from response
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Statistics data received:', data.length, 'songs');
      setDroppedSongs(data);
    } catch (err) {
      console.error('Error fetching dropped songs:', err);
      setError(`Failed to load statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getSongSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  if (loading) {
    return (
      <div className="statistics-container">
        <header className="header">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>?? TOP 2000</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/statistics" className="nav-link active">Statistics</Link>
          </nav>
        </header>
        <main className="main-content">
          <div className="loading">Statistieken laden...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-container">
        <header className="header">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>TOP 2000</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/statistics" className="nav-link active">Statistieken</Link>
          </nav>
        </header>
        <main className="main-content">
          <div className="error">
            <p>{error}</p>
            <button onClick={() => fetchDroppedSongs()} className="retry-button">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <header className="header">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>TOP 2000</Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/statistics" className="nav-link active">Statistics</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="statistics-header">
          <h1 className="statistics-title">Grootste dalingen</h1>
          <p className="statistics-description">
            Nummers die zijn gedaald ten opzichte van de vorige jaren
          </p>
          
          <div className="year-selector">
            <label htmlFor="year-select">Selecteer jaar:</label>
            <select 
              id="year-select"
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="year-dropdown"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {droppedSongs.length === 0 ? (
          <div className="no-data">
            <h2>No dropped songs found for {selectedYear}</h2>
            <p>This could mean:</p>
            <ul>
              <li>No songs dropped in position this year</li>
              <li>No data available for {selectedYear - 1} or {selectedYear}</li>
              <li>Database might not have historical data</li>
            </ul>
          </div>
        ) : (
          <section className="table-section">
            <div className="table-header-bar">
              <h3>Songs That Dropped in {selectedYear} ({droppedSongs.length} songs)</h3>
            </div>
            <div className="table-container">
              <table className="statistics-table">
                <thead>
                  <tr>
                    <th>RANK</th>
                    <th>IMAGE</th>
                    <th>TITLE</th>
                    <th>ARTIST</th>
                    <th>YEAR</th>
                    <th>POSITION {selectedYear}</th>
                    <th>POSITION {selectedYear - 1}</th>
                    <th>DROPPED</th>
                  </tr>
                </thead>
                <tbody>
                  {droppedSongs.map((song, index) => (
                    <tr key={song.songId}>
                      <td className="rank-cell">{index + 1}</td>
                      <td className="image-cell">
                        {song.imgUrl ? (
                          <img src={song.imgUrl} alt={song.titel} className="song-thumbnail" />
                        ) : (
                          <div className="song-thumbnail-placeholder">??</div>
                        )}
                      </td>
                      <td className="title-cell">
                        <Link 
                          to={`/song/${getSongSlug(song.titel)}`}
                          className="song-title-link"
                        >
                          {song.titel}
                        </Link>
                      </td>
                      <td className="artist-cell">{song.artistName}</td>
                      <td className="year-cell">{song.releaseYear || '–'}</td>
                      <td className="position-cell current-pos">#{song.currentPosition}</td>
                      <td className="position-cell previous-pos">#{song.previousPosition}</td>
                      <td className="dropped-cell">
                        <span className="drop-badge">
                          - {song.positionsDropped}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="statistics-footer">
          <button onClick={() => navigate('/')} className="back-button">
            ? Back to Homepage
          </button>
        </div>
      </main>
    </div>
  );
}

export default Statistics;
