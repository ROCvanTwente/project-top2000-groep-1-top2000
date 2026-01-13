import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SongDetail.css';

const API_BASE_URL = 'https://localhost:7003/api';

function SongDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSongDetail();
  }, [slug]);

  const fetchSongDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/songs/by-title/${encodeURIComponent(slug)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Song not found');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
      
      const data = await response.json();
      setSong(data);
    } catch (err) {
      console.error('Error fetching song details:', err);
      setError('Failed to load song details. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="song-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Top 2000
        </button>
        <div className="loading">Loading song details...</div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="song-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Top 2000
        </button>
        <div className="song-detail-error">
          <h2>{error || 'Song not found'}</h2>
          <button onClick={() => navigate('/')} className="retry-button">
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  const positionChange = song.positionChange || 0;
  const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(song.titel + ' ' + song.artistName)}`;

  return (
    <div className="song-detail-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Top 2000
      </button>

      <div className="song-detail-content">
        {/* Album Cover Section */}
        <div className="song-detail-header">
          <div className="song-detail-cover">
            {song.imgUrl ? (
              <img src={song.imgUrl} alt={song.titel} />
            ) : (
              <div className="song-detail-cover-placeholder">
                <span>🎵</span>
              </div>
            )}
            <div className="song-position-badge">#{song.currentPosition}</div>
          </div>

          <div className="song-detail-info">
            <h1 className="song-detail-title">{song.titel}</h1>
            <h2 className="song-detail-artist">{song.artistName}</h2>
            
            <div className="song-detail-meta">
              <div className="meta-item">
                <span className="meta-label">Year</span>
                <span className="meta-value">{song.releaseYear || 'Unknown'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Current Position</span>
                <span className="meta-value position-highlight">#{song.currentPosition}</span>
              </div>
              {song.previousPosition && (
                <div className="meta-item">
                  <span className="meta-label">Previous Position</span>
                  <span className="meta-value">#{song.previousPosition}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Change</span>
                <span className={`meta-value change-${positionChange > 0 ? 'up' : positionChange < 0 ? 'down' : 'none'}`}>
                  {positionChange > 0 ? `↑ ${positionChange}` : 
                   positionChange < 0 ? `↓ ${Math.abs(positionChange)}` : 
                   '– No change'}
                </span>
              </div>
            </div>

            <div className="song-detail-actions">
              <a 
                href={spotifySearchUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="spotify-button"
              >
                <span className="spotify-icon">♫</span> Listen on Spotify
              </a>
              {song.youtube && (
                <a 
                  href={song.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="spotify-button"
                  style={{ backgroundColor: '#ff0000' }}
                >
                  <span className="spotify-icon">▶</span> YouTube
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Historical Position Chart */}
        {song.history && song.history.length > 0 && (
          <div className="song-detail-history">
            <h3 className="history-title">Position History (Last 5 Years)</h3>
            <div className="history-chart">
              {song.history.map((entry) => (
                <div key={entry.year} className="history-entry">
                  <div className="history-year">{entry.year}</div>
                  <div className="history-bar-container">
                    <div 
                      className="history-bar" 
                      style={{
                        width: `${100 - (entry.position / 2000 * 100)}%`,
                        backgroundColor: entry.year === 2024 ? '#ff0000' : '#666'
                      }}
                    >
                      <span className="history-position">#{entry.position}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Album Information */}
        <div className="song-detail-album">
          <h3 className="album-info-title">Song Information</h3>
          <div className="album-info-content">
            <div className="album-info-item">
              <span className="info-label">Release Year:</span>
              <span className="info-value">{song.releaseYear || 'Unknown'}</span>
            </div>
            <div className="album-info-item">
              <span className="info-label">Artist:</span>
              <span className="info-value">{song.artistName}</span>
            </div>
            <div className="album-info-item">
              <span className="info-label">Song Title:</span>
              <span className="info-value">{song.titel}</span>
            </div>
            <div className="album-info-item">
              <span className="info-label">2024 Position:</span>
              <span className="info-value">#{song.currentPosition}</span>
            </div>
            {song.previousPosition && (
              <div className="album-info-item">
                <span className="info-label">2023 Position:</span>
                <span className="info-value">#{song.previousPosition}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lyrics Section (if available) */}
        {song.lyrics && (
          <div className="song-detail-album" style={{ marginTop: '40px' }}>
            <h3 className="album-info-title">Lyrics</h3>
            <div className="album-info-content">
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'inherit', 
                color: '#ccc',
                lineHeight: '1.6'
              }}>
                {song.lyrics}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SongDetail;
