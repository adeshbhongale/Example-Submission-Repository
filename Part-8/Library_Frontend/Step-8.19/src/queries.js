import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      genres
      id
      author {
        name
        born
        id
      }
    }
  }
`;


export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      id
      title
      published
      genres
      author {
        id
        name
        born
      }
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      id
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $favoriteGenre: String!) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      id
      username
      favoriteGenre
    }
  }
`;
