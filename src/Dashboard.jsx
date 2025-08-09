import { useState, useEffect, useRef } from 'react';
import './styles.css';
import Listing from './Listing';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('home');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to true for desktop
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
        const data = await response.json();
        const formattedListings = data.map((item) => ({
          id: item.id,
          title: item.title,
          price: Math.floor(Math.random() * 500) + 50,
          location: ['Lagos', 'Abuja', 'Port Harcourt'][Math.floor(Math.random() * 3)],
        }));
        setListings(formattedListings);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (window.matchMedia('(max-width: 768px)').matches) {
      setIsSidebarOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside); // Support touch
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleToggleClick = (event) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop event bubbling
    console.log('Toggle clicked, state:', !isSidebarOpen, 'Width:', window.innerWidth, 'Target:', event.target, 'Error:', event.type);
    setIsSidebarOpen(prev => {
      const newState = !prev;
      console.log('New state set to:', newState);
      return newState;
    });
  };

  const renderContent = () => {
    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    switch (activeSection) {
      case 'home':
        return (
          <>
            <h2 className="welcome-title">Welcome to Your Marketplace</h2>
            <p className="welcome-text">Explore listings and manage your items here.</p>
            <input
              type="text"
              className="search-input"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="listings-container">
              {filteredListings.map((listing) => (
                <Listing
                  key={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location}
                />
              ))}
            </div>
          </>
        );
      case 'listings':
        return (
          <div className="listings-container">
            <h2 className="section-title">All Listings</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredListings.map((listing) => (
              <Listing
                key={listing.id}
                title={listing.title}
                price={listing.price}
                location={listing.location}
              />
            ))}
          </div>
        );
      case 'profile':
        return (
          <div>
            <h2 className="section-title">Your Profile</h2>
            <p className="profile-text">Manage your account and listings here.</p>
          </div>
        );
      default:
        return <h2>Section Not Found</h2>;
    }
  };

  return (
    <div className="dashboard" onClick={(e) => console.log('Dashboard click:', e.target)}>
      <header className="header">
        <h1 className="header-title">Marketplace Dashboard</h1>
        <button ref={toggleRef} className="menu-toggle" onClick={handleToggleClick} aria-label="Toggle menu">
          ☰
        </button>
      </header>
      <div className="container">
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
          <nav>
            <ul>
              <li
                className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </li>
              <li
                className={`nav-item ${activeSection === 'listings' ? 'active' : ''}`}
                onClick={() => handleNavClick('listings')}
              >
                Listings
              </li>
              <li
                className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
                onClick={() => handleNavClick('profile')}
              >
                Profile
              </li>
            </ul>
          </nav>
        </div>
        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;