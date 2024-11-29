import {
  Row,
  Col,
  Container,
  Carousel,
  Pagination,
  Button,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import AdminHome from "../components/AdminHome";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 6;

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

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Container>
        {user.isAdmin ? (
          <h1>Admin Dashboard</h1>
        ) : (
          <>
            <Container className="p-0">
              {/* Featured Movies Carousel */}
              <Row className="featured-section my-5 text-center">
                <Carousel>
                  {movies
                    .sort(() => 0.5 - Math.random()) // Randomize movies
                    .slice(0, 5) // Display only 5 movies in the carousel
                    .map((movie) => (
                      <Carousel.Item key={movie._id}>
                        <div className="d-flex justify-content-center">
                          <div
                            style={{
                              width: "100%",
                              height: "600px",
                              overflow: "hidden",
                              borderRadius: "10px",
                            }}
                          >
                            {/* Movie Image */}
                            <img
                              src={
                                movie.image ||
                                "https://m.media-amazon.com/images/I/71u4ibuAdsL._AC_SL1500_.jpg"
                              } // Default image if none provided
                              alt={movie.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover", // Ensures the image covers the entire div
                                objectPosition: "top",
                                borderRadius: "4px",
                              }}
                            />
                          </div>
                        </div>
                        <Carousel.Caption>
                          <h5>{movie.title}</h5>
                          <p>
                            {movie.genre} - {movie.year}
                          </p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    ))}
                </Carousel>
              </Row>

              {/* More Movies Section */}
              <Row className="more-movies-section my-5">
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
        {user.id ? (
  <Link
    className="btn btn-primary d-block"
    to={`/movies/${movie._id}`}
    style={{
      marginTop: "auto", // Ensures the button stays at the bottom
    }}
  >
    View
  </Link>
) : (
  <Link
    className="btn btn-primary d-block"
    to="/login"
    style={{
      marginTop: "auto", // Ensures the button stays at the bottom
    }}
  >
    View
  </Link>
)}

      </div>
    </Col>
  ))}
</Row>


              {/* Pagination */}
              {movies.length > moviesPerPage && (
                <Pagination className="justify-content-center">
                  {Array.from(
                    { length: Math.ceil(movies.length / moviesPerPage) },
                    (_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => paginate(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    )
                  )}
                </Pagination>
              )}
            </Container>
          </>
        )}
      </Container>
    </>
  );
}
