import { useContext, useState, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { Row, Col, Container } from 'react-bootstrap'; // Import Container
import { Link } from 'react-router-dom';

export default function UserView() {
    const [movies, setMovies] = useState([]); // Correctly imported useState
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 9;

    const { user } = useContext(UserContext); // Assuming you are getting user data from UserContext

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
    }, [user]); // Assuming user is the context that triggers a re-fetch when changed

    // Calculate current movies for pagination
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    return (
        <Container className="my-5"> {/* Wrap Row inside Container */}
            <Row className="more-movies-section">
                <h3 className="text-center text-secondary mb-4">Recommended</h3>
                {currentMovies.map((movie) => (
                    <Col key={movie._id} md={4} className="mb-4">
                        <div
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                padding: "15px",
                                background: "#fff",
                                height: "600px", // Fixed height for the card
                                display: "flex",
                                flexDirection: "column", // Ensures content inside the card is stacked vertically
                                justifyContent: "space-between", // Distributes space between elements
                            }}
                        >
                            {/* Movie Image */}
                            <img
                                src={movie.imgUrl}
                                alt="Movie"
                                style={{
                                    width: "100%",
                                    height: "400px", // Fixed height for the image
                                    objectFit: "cover", // Ensures the image covers the area
                                    objectPosition: "top", // Keeps the top part of the image visible
                                    borderRadius: "5px",
                                    marginBottom: "10px",
                                }}
                            />
                            <h5>{movie.title}</h5>
                            <p
                                style={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    WebkitLineClamp: 2,
                                    textOverflow: "ellipsis",
                                    marginBottom: "auto", // Pushes the button to the bottom
                                }}
                            >
                                {movie.description}
                            </p>
                            <Link
                                className="btn btn-primary d-block"
                                to={`/movies/${movie._id}`}
                                style={{
                                    marginTop: "auto", // Ensures the button stays at the bottom
                                }}
                            >
                                View
                            </Link>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
