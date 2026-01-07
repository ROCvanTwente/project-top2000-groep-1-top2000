import { useState } from 'react'
import './App.css'

// Placeholder data - easily replaceable with API data later
const PLACEHOLDER_SONGS = [
    {
        id: 1,
        title: "Bohemian Rhapsody",
        artist: "Queen",
        year: 1975,
        currentPosition: 1,
        previousPosition: 1,
        positionChange: 0,
        albumCoverUrl: "https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png"
    },
    {
        id: 2,
        title: "Hotel California",
        artist: "Eagles",
        year: 1977,
        currentPosition: 2,
        previousPosition: 3,
        positionChange: 1,
        albumCoverUrl: "https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg"
    },
    {
        id: 3,
        title: "Imagine",
        artist: "John Lennon",
        year: 1971,
        currentPosition: 3,
        previousPosition: 2,
        positionChange: -1,
        albumCoverUrl: "https://upload.wikimedia.org/wikipedia/en/1/1d/John_Lennon_-_Imagine_John_Lennon.jpg"
    },
    {
        id: 4,
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        year: 1971,
        currentPosition: 4,
        previousPosition: 5,
        positionChange: 1,
        albumCoverUrl: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg"
    },
    {
        id: 5,
        title: "Comfortably Numb",
        artist: "Pink Floyd",
        year: 1979,
        currentPosition: 5,
        previousPosition: 4,
        positionChange: -1,
        albumCoverUrl: "https://upload.wikimedia.org/wikipedia/en/d/d6/Pink_Floyd_-_all_n1.jpg"
    },
    {
        id: 6,
        title: "Wish You Were Here",
        artist: "Pink Floyd",
        year: 1975,
        currentPosition: 6,
        previousPosition: 6,
        positionChange: 0,
        albumCoverUrl: null
    },
    {
        id: 7,
        title: "Child In Time",
        artist: "Deep Purple",
        year: 1970,
        currentPosition: 7,
        previousPosition: 8,
        positionChange: 1,
        albumCoverUrl: null
    },
    {
        id: 8,
        title: "The Sound of Silence",
        artist: "Simon & Garfunkel",
        year: 1964,
        currentPosition: 8,
        previousPosition: 7,
        positionChange: -1,
        albumCoverUrl: null
    },
    {
        id: 9,
        title: "One",
        artist: "U2",
        year: 1991,
        currentPosition: 9,
        previousPosition: 10,
        positionChange: 1,
        albumCoverUrl: null
    },
    {
        id: 10,
        title: "Kashmir",
        artist: "Led Zeppelin",
        year: 1975,
        currentPosition: 10,
        previousPosition: 9,
        positionChange: -1,
        albumCoverUrl: null
    },
    {
        id: 11,
        title: "Yesterday",
        artist: "The Beatles",
        year: 1965,
        currentPosition: 11,
        previousPosition: 11,
        positionChange: 0,
        albumCoverUrl: null
    },
    {
        id: 12,
        title: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        year: 1987,
        currentPosition: 12,
        previousPosition: 14,
        positionChange: 2,
        albumCoverUrl: null
    },
    {
        id: 13,
        title: "Nothing Else Matters",
        artist: "Metallica",
        year: 1991,
        currentPosition: 13,
        previousPosition: 12,
        positionChange: -1,
        albumCoverUrl: null
    },
    {
        id: 14,
        title: "November Rain",
        artist: "Guns N' Roses",
        year: 1991,
        currentPosition: 14,
        previousPosition: 15,
        positionChange: 1,
        albumCoverUrl: null
    },
    {
        id: 15,
        title: "The Show Must Go On",
        artist: "Queen",
        year: 1991,
        currentPosition: 15,
        previousPosition: 13,
        positionChange: -2,
        albumCoverUrl: null
    },
    {
        id: 16,
        title: "Avond",
        artist: "Boudewijn de Groot",
        year: 1997,
        currentPosition: 16,
        previousPosition: 17,
        positionChange: 1,
        albumCoverUrl: null
    },
    {
        id: 17,
        title: "Life On Mars?",
        artist: "David Bowie",
        year: 1971,
        currentPosition: 17,
        previousPosition: 16,
        positionChange: -1,
        albumCoverUrl: null
    },
    {
        id: 18,
        title: "Purple Rain",
        artist: "Prince",
        year: 1984,
        currentPosition: 18,
        previousPosition: 19,
        positionChange: 1,
        albumCoverUrl: null
    },
    {
        id: 19,
        title: "Shine On You Crazy Diamond",
        artist: "Pink Floyd",
        year: 1975,
        currentPosition: 19,
        previousPosition: 18,
        positionChange: -1,
        albumCoverUrl: null
    },
    {
        id: 20,
        title: "Black",
        artist: "Pearl Jam",
        year: 1991,
        currentPosition: 20,
        previousPosition: 20,
        positionChange: 0,
        albumCoverUrl: null
    }
];

function App() {
    const [songs] = useState(PLACEHOLDER_SONGS);
    const [featuredSongs] = useState(PLACEHOLDER_SONGS.slice(0, 5));

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

    return (
        <div className="app">
            <header className="header">
                <div className="logo">TOP 2000</div>
                <nav className="nav">
                    <a href="#home" className="nav-link active">Home</a>
                    <a href="#list" className="nav-link">Lijst</a>
                    <a href="#stats" className="nav-link">Statistics</a>
                    <a href="#stemmen" className="nav-link">Stemmen</a>
                    <a href="#info" className="nav-link">Info</a>
                    <a href="#account" className="nav-link">Profiel</a>
                </nav>
            </header>

            <main className="main-content">
                <section className="featured-section">
                    <h2 className="section-title">TOP 2000 2025</h2>
                    <div className="featured-albums">
                        {featuredSongs.map((song) => (
                            <div key={song.id} className="album-card">
                                <div className="position-badge">{song.currentPosition}</div>
                                {song.albumCoverUrl ? (
                                    <img src={song.albumCoverUrl} alt={song.title} className="album-cover" />
                                ) : (
                                    <div className="album-cover-placeholder">
                                        <span>🎵</span>
                                    </div>
                                )}
                                <div className="album-info">
                                    <p className="album-title">{song.title}</p>
                                    <p className="album-artist">{song.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="table-section">
                    <div className="table-header-bar">
                        <h3>TOP 2000 2025</h3>
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
                                    <tr key={song.id}>
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
                                            {song.albumCoverUrl ? (
                                                <img src={song.albumCoverUrl} alt={song.title} className="song-thumbnail" />
                                            ) : (
                                                <div className="song-thumbnail-placeholder">???</div>
                                            )}
                                        </td>
                                        <td className="title-cell">{song.title}</td>
                                        <td className="artist-cell">{song.artist}</td>
                                        <td className="year-cell">{song.year}</td>
                                        <td className="action-cell">
                                            <button className="listen-button">Listen Now</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default App

/* 
  TO CONNECT TO BACKEND API:
  
  1. Replace the PLACEHOLDER_SONGS array with API call:
     
     useEffect(() => {
       fetchSongs();
     }, []);
     
     const fetchSongs = async () => {
       try {
         const response = await fetch('YOUR_API_URL/api/songs');
         const data = await response.json();
         setSongs(data);
         setFeaturedSongs(data.slice(0, 5));
       } catch (error) {
         console.error('Error fetching songs:', error);
       }
     };
  
  2. The data structure should match:
     {
       id: number,
       title: string,
       artist: string,
       year: number,
       currentPosition: number,
       previousPosition: number | null,
       positionChange: number | null,
       albumCoverUrl: string | null
     }
*/
