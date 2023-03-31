import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { useLazyQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { DELETE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [oneUser] = useLazyQuery(QUERY_ME);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const url = window.location.href;

  // Determins if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    getUserData();
    console.log("effect");
  }, [url, userDataLength]);

  const getUserData = async () => {
    try {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }

      const { data } = Auth.getProfile(token);
      const user = data;

      if (!user) {
        return false;
      }

      // Get user's saved books
      const thisUser = await oneUser({
        variables: {
          id: user._id,
          username: user.username,
        },
        pollInterval: 500,
      });
      console.log(thisUser.data.oneUser);

      setUserData(thisUser.data.oneUser);
    } catch (err) {
      console.error(err);
    }
  };

  // Function that accepts the book's _id value as a parameter and deletes book from database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    const { data } = Auth.getProfile(token);
    const user = data;

    if (!user) {
      return false;
    }

    try {
      const thisBook = await deleteBook({
        variables: {
          id: user._id,
          bookId: bookId,
        },
      });

      setUserData(thisBook.data.deleteBook);
      // Deletes book from local storage if succeeds
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Shows loading if data isn't ready
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
          <Button className="btn-block" onClick={() => getUserData()}>
            Refresh!
          </Button>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
