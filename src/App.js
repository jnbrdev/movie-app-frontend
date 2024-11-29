import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Movies from './pages/Movies';
import { UserProvider } from './context/UserContext';
import './App.css'
import Footer from './components/Footer';
import AppNavbar from './components/AppNavBar';
import MoviesView from './components/MoviesView';
function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });
  const unsetUser = () => {

    localStorage.clear();

  };
  useEffect(() => {

    fetch(`https://movie-app-api-k8ir.onrender.com/users/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token') }`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)

      if (typeof data.user !== "undefined") {

        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin
        });

      } else {

        setUser({
          id: null
        });

      }

    })

    }, []);

    useEffect(() => {
      console.log(user);
      console.log(localStorage);
    }, [user])

    return (
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <AppNavbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/movies/:movieId" element={<MoviesView />} />
            </Routes>
        </Router>
        <Footer />
      </UserProvider>
  );
}

export default App;