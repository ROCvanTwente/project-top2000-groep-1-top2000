import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SongDetail from './components/SongDetail'
import './App.css'

const API_BASE_URL = 'https://localhost:7003/api';

function HomePage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSongs, setTotalSongs] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    fetchSongs(currentPage);
  }, [currentPage]);

  const fetchSongs = async (page) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/songs?page=${page}&pageSize=${pageSize}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSongs(data.songs);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalSongs(data.totalSongs);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to load songs. Make sure the API is running on https://localhost:7003');
    } finally {
      setLoading(false);
    }
  };

  const getSongSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  const getPositionChangeIcon = (change) => {
    if (!change || change === 0) return '–';
    if (change > 0) return '↑';
    return '↓';
  };

  const getPositionChangeClass = (change) => {
    if (!change || change === 0) return 'no-change';
    if (change > 0) return 'position-up';
    return 'position-down';
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const featuredSongs = songs.slice(0, 5);

  if (loading && songs.length === 0) {
    return (
      <div className="app">
        <header className="header">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>🎵 TOP 2000</Link>
          <nav className="nav">
            <Link to="/" className="nav-link active">Home</Link>
            <a href="#list" className="nav-link">Lijst</a>
            <a href="#stats" className="nav-link">Statistics</a>
            <a href="#stemmen" className="nav-link">Stemmen</a>
            <a href="#info" className="nav-link">Info</a>
            <a href="#account" className="nav-link">👤</a>
          </nav>
        </header>
        <main className="main-content">
          <div className="loading">Loading Top 2000...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>🎵 TOP 2000</Link>
          <nav className="nav">
            <Link to="/" className="nav-link active">Home</Link>
            <a href="#list" className="nav-link">Lijst</a>
            <a href="#stats" className="nav-link">Statistics</a>
            <a href="#stemmen" className="nav-link">Stemmen</a>
            <a href="#info" className="nav-link">Info</a>
            <a href="#account" className="nav-link">👤</a>
          </nav>
        </header>
        <main className="main-content">
          <div className="error">
            <p>{error}</p>
            <button onClick={() => fetchSongs(currentPage)} className="retry-button">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>🎵 TOP 2000</Link>
        <nav className="nav">
          <Link to="/" className="nav-link active">Home</Link>
          <a href="#list" className="nav-link">Lijst</a>
          <a href="#stats" className="nav-link">Statistics</a>
          <a href="#stemmen" className="nav-link">Stemmen</a>
          <a href="#info" className="nav-link">Info</a>
          <a href="#account" className="nav-link">👤</a>
        </nav>
      </header>

      <main className="main-content">
        {currentPage === 1 && featuredSongs.length > 0 && (
          <section className="featured-section">
            <h2 className="section-title">TOP 2000 2024</h2>
            <div className="featured-albums">
              {featuredSongs.map((song) => (
                <Link 
                  key={song.songId} 
                  to={`/song/${getSongSlug(song.titel)}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="album-card">
                    <div className="position-badge">{song.currentPosition}</div>
                    {song.imgUrl ? (
                      <img src={song.imgUrl} alt={song.titel} className="album-cover" />
                    ) : (
                      <div className="album-cover-placeholder">
                        <span>🎵</span>
                      </div>
                    )}
                    <div className="album-info">
                      <p className="album-title">{song.titel}</p>
                      <p className="album-artist">{song.artistName}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="table-section">
          <div className="table-header-bar">
            <h3>TOP 2000 2024 - Page {currentPage} of {totalPages} ({totalSongs} songs)</h3>
          </div>
          <div className="table-container">
            <table className="songs-table">
              <thead>
                <tr>
                  <th>POS</th>
                  <th>±</th>
                  <th>IMAGE</th>
                  <th>TITLE</th>
                  <th>ARTIST</th>
                  <th>YEAR</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.songId}>
                    <td className="position-cell">{song.currentPosition}</td>
                    <td className={`change-cell ${getPositionChangeClass(song.positionChange)}`}>
                      <span className="change-value">
                        {song.positionChange ? Math.abs(song.positionChange) : '–'}
                      </span>
                      <span className="change-icon">
                        {getPositionChangeIcon(song.positionChange)}
                      </span>
                    </td>
                    <td className="image-cell">
                      {song.imgUrl ? (
                        <img src={song.imgUrl} alt={song.titel} className="song-thumbnail" />
                      ) : (
                        <div className="song-thumbnail-placeholder">🎵</div>
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
                    <td className="action-cell">
                      <button className="listen-button">Listen Now</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button 
              className="pagination-button" 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="pagination-numbers">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            <button 
              className="pagination-button" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/song/:slug" element={<SongDetail />} />
      </Routes>
    </Router>
  );
}

export default App
