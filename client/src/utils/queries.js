import { gql } from '@apollo/client';
import axios from 'axios';

export const QUERY_ME = gql`
  query OneUser($id: ID!, $username: String!) {
    oneUser(id: $id, username: $username) {
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const searchGoogleBooks = (query) => {
  return axios(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
}