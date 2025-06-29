import React, { useState, useEffect } from 'react';
import Map from './Map';
import { cafeService } from './services/CafeService';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const data = await cafeService.getCafes('', []);
        setCafes(data);
      } catch (error) {
        console.error('Error fetching cafes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCafes();
  }, []);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    const data = await cafeService.getCafes(e.target.value, selectedFilters);
    setCafes(data);
  };

  const handleFilter = async (filter) => {
    setSelectedFilters((prev) => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
    const data = await cafeService.getCafes(searchQuery, selectedFilters);
    setCafes(data);
  };

  return loading ? (
    <div className="loading">Loading...</div>
  ) : (
    <div className="App">
      <header className="header">
        <div className="logo">Digital Nomad Cafes</div>
        <div className="logo-placeholder">Logo</div>
      </header>
      <div className="content-wrapper">
        <aside className="sidebar">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search by city..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="filters">
            <button
              className={`filter-btn ${selectedFilters.includes('popular') ? 'active' : ''}`}
              onClick={() => handleFilter('popular')}
            >
              Popular
            </button>
            <button
              className={`filter-btn ${selectedFilters.includes('wifi') ? 'active' : ''}`}
              onClick={() => handleFilter('wifi')}
            >
              Good WiFi
            </button>
            <button
              className={`filter-btn ${selectedFilters.includes('outlets') ? 'active' : ''}`}
              onClick={() => handleFilter('outlets')}
            >
              Power Outlets
            </button>
          </div>
          <ul className="cafe-list">
            {cafes.map((cafe) => (
              <li key={cafe.id} className="cafe-item">
                <div className="cafe-info">
                  <h3 className="cafe-name">{cafe.name}</h3>
                  <p className="cafe-details">{cafe.address}</p>
                  <p className="cafe-details">WiFi: {cafe.wifiQuality}</p>
                  <p className="cafe-details">Rating: {cafe.rating}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <main className="map-container">
          <Map cafes={cafes} selectedFilters={selectedFilters} />
        </main>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Digital Nomad Cafes</p>
      </footer>
    </div>
  );
}

export default App;
