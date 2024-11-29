import { useContext } from "react";
import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Badge, Dropdown, Button} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../context/UserContext";
import '../App.css';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
<Navbar expand="lg" className="sticky-top navbar">
  <Container>
    <Navbar.Brand as={Link} to="/" className="brand-font text-white">
      Nextplease
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto">
        {user.id !== null ? (
          user.isAdmin ? (
            <>
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="profile-dropdown" className="text-white">
                  <FontAwesomeIcon icon={faUser} className="text-white" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/movies" className="text-white">
                Movies
              </Nav.Link>
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="profile-dropdown" className="text-white">
                  <FontAwesomeIcon icon={faUser} className="text-white" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )
        ) : (
          // Other navbar links for logged-out users go here
          <></>
        )}
      </Nav>
    </Navbar.Collapse>

    {/* Login and Register buttons outside Navbar.Collapse to always show on small screens */}
    {user.id === null && (
      <Nav className="d-flex">
                      <Nav.Link as={Link} to="/movies" className="text-white">
                Movies
              </Nav.Link>
        <Nav.Link as={NavLink} to="/login" exact="true" className="text-white">
          <Button  className="nav-button">Login</Button>
        </Nav.Link>
        <Nav.Link as={NavLink} to="/register" exact="true" className="text-white">
          <Button className="nav-button">Register</Button>
        </Nav.Link>
      </Nav>
    )}
  </Container>
</Navbar>

  );
}
