import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import PostForm from './Components/PostForm';

function Nav() {
  const token = localStorage.getItem('token');

  return (
    <nav style={{ padding: '1rem', background: '#333', color: 'white' }}>
      <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
      {token ? (
        <>
          <Link to="/create" style={{ color: 'white', marginRight: '1rem' }}>Create Post</Link>
          <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</Link>
          <Link to="/register" style={{ color: 'white' }}>Register</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<PostForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<PostForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;