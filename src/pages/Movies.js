import { useState, useEffect, useContext, useCallback } from 'react';
import UserView from '../components/UserView';
import AdminHome from '../components/AdminHome';
import UserContext from '../context/UserContext';

export default function Movies() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);

  // Use useCallback to memoize fetchData and prevent unnecessary re-renders
  const fetchData = () => {
    let fetchUrl = `https://movie-app-api-k8ir.onrender.com/movies/getMovies`;
    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies || []);
      });
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      {user.isAdmin === true
        ? <AdminHome />
        : <UserView moviesData={movies} />}
    </>
  );
}
