import { useState, useEffect, useContext } from 'react';
import { Card, Row, Container, Col, Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Notyf } from 'notyf';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function MoviesView() {
  const notyf = new Notyf();
  const { movieId } = useParams();
  const { user } = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState(0);
  const [comments, setComments] = useState([]); // Ensure it's initialized as an array
  const [newComment, setNewComment] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  // Fetch movie details and comments
  useEffect(() => {
    fetch(`https://movie-app-api-k8ir.onrender.com/movies/getMovie/${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setGenre(data.genre);
        setDirector(data.director);
        setImgUrl(data.imgUrl);
        setYear(data.year);
      });

      fetch(`https://movie-app-api-k8ir.onrender.com/movies/getComments/${movieId}`, {
        headers: {
          Authorization: `Bearer ${ localStorage.getItem('token') }`
        }
      })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []); // Safely access the `comments` property
      });
  }, [movieId]);

  // Add a new comment
  const addComment = () => {
    if (!newComment.trim()) {
      notyf.error("Comment cannot be empty!");
      return;
    }
  
    const commentData = {
      comment: newComment,
    };
  
    fetch(`https://movie-app-api-k8ir.onrender.com/movies/addComment/${movieId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(commentData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Comment added successfully") {
          // Refetch the comments
          fetch(`https://movie-app-api-k8ir.onrender.com/movies/getComments/${movieId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => res.json())
            .then((commentsData) => {
              setComments(commentsData.comments || []);
              setNewComment(""); // Clear the input field
              notyf.success("Comment added!");
            })
            .catch(() => {
              notyf.error("Failed to refresh comments.");
            });
        } else {
          notyf.error(data.message || "Failed to add comment.");
        }
      })
      .catch(() => {
        notyf.error("Error adding comment.");
      });
  };
  

  return (
    user && user.id ? (
      <Container>
        <Row className="mt-3">
          {/* First Column: Placeholder Image */}
          <Col sm={12} lg={4}>
            <Card style={{ height: '600px', overflow: 'hidden' }}>
              <Card.Img
                variant="top"
                src={imgUrl}
                alt="Placeholder"
                style={{ objectFit: 'cover', height: '100%' }}
              />
            </Card>
          </Col>

          {/* Second Column: Movie Data */}
          <Col sm={12} lg={8}>
            <Card>
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {description}
                </Card.Text>
                <Card.Text>
                  <strong>Genre:</strong> {genre}
                </Card.Text>
                <Card.Text>
                  <strong>Director:</strong> {director}
                </Card.Text>
                <Card.Text>
                  <strong>Year:</strong> {year}
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className='my-3'>
              <Card.Body>
                <h5>Comments</h5>
                {/* Textarea for new comment */}
                {user && user.id ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={addComment}>
                      Add Comment
                    </Button>
                  </>
                ) : null}

                {/* Display existing comments */}
                <div className="mt-3">
                  {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <Card className="mb-2" key={comment._id || index}>
                        <Card.Body>
                          <strong>Name: {comment.userId}</strong>
                          <p>{comment.comment}</p>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Third Column: Comments */}
          <Col className='my-4' sm={12} lg={12}>
          </Col>
        </Row>
      </Container>
    ) : (
      <Navigate to="/login" />
    )
  );
}

