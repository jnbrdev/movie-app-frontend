import { useState, useEffect, useContext } from 'react';
import { Row, Col, Table, Button, Offcanvas, Form, Container } from 'react-bootstrap';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { Notyf } from "notyf";
export default function AdminHome() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const [movies, setMovies] = useState([]);
    const [showAddMovie, setShowAddMovie] = useState(false);
    const [newMovie, setNewMovie] = useState({
        title: '',
        description: '',
        genre: '',
        director: '',
        year: '',
        imgUrl: '',
    });

    const handleShowAddMovie = () => setShowAddMovie(true);
    const handleCloseAddMovie = () => setShowAddMovie(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMovie((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddMovie = async () => {
        try {
            fetch(`https://movie-app-api-k8ir.onrender.com/movies/addMovie`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ 
                    title: newMovie.title, 
                    description: newMovie.description, 
                    genre: newMovie.genre, 
                    director: newMovie.director, 
                    year: newMovie.year, 
                    imgUrl: newMovie.imgUrl, 
                 }), // Convert to JSON
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.message === "Action Forbidden") {
                    notyf.error("Action Forbidden");
                  } else {
                    notyf.success("Workout Added");
                    fetchData()
                    setNewMovie({
                        title: '',
                        description: '',
                        genre: '',
                        director: '',
                        year: '',
                    })
                    handleCloseAddMovie()
                  }
                })
                .catch((error) => {
                  notyf.error("Failed to add Workout. Please try again.");
                });
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

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
        <Container>
            <div className="mt-2 pt-3">
                <Row className="mt-4">
                    <Col>
                        <h1>Admin Home</h1>
                        <Button variant="primary" onClick={handleShowAddMovie}>
                            Add Movie
                        </Button>
                        <Table striped bordered hover className="mt-4">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Genre</th>
                                    <th>Director</th>
                                    <th>Year</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map((movie) => (
                                    <tr key={movie._id}>
                                        <td>{movie.title}</td>
                                        <td>{movie.description}</td>
                                        <td>{movie.genre}</td>
                                        <td>{movie.director}</td>
                                        <td>{movie.year}</td>
                                        <td>
                                            <Button variant="warning" size="sm" className="me-2">
                                                Edit
                                            </Button>
                                            <Button variant="danger" size="sm">
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>

            {/* Offcanvas for Add Movie */}
            <Offcanvas show={showAddMovie} onHide={handleCloseAddMovie} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add Movie</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                    <Form.Group className="mb-3">
                            <Form.Label>Image URL: (Add Link)</Form.Label>
                            <Form.Control
                                type="text"
                                name="imgUrl"
                                value={newMovie.imgUrl}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newMovie.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={newMovie.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                name="genre"
                                value={newMovie.genre}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Director</Form.Label>
                            <Form.Control
                                type="text"
                                name="director"
                                value={newMovie.director}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="number"
                                name="year"
                                value={newMovie.year}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddMovie}>
                            Add Movie
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </Container>
    );
}
