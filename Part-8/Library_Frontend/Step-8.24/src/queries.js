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

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const BOOKS_BY_GENRE = gql`
  query BooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      id
     
    }
  }
`;
export const RECOMMENDED_BOOKS = gql`
  query {
    recommendedBooks {
      id
      title
      published
      genres
      author {
        id
        name
      }
    }
  }
`;
// export const ALL_BOOKS_BY_GENRE = gql`
//   query AllBooksByGenre($genre: String) {
//     allBooks(genre: $genre) {
//       title
//       author {
//         name
//       }
//       published
//       id
//       genres
//     }
//   }
// `;

export const ALL_BOOKS_BY_GENRE = gql`
  query AllBooksByGenre($genre: String) {
    allBooks(genre: $genre) {
      id
      title
      published
      genres
      author {
        name
      }
    }
  }
`;
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      id
      genres
      author {
        name
      }
    }
  }
`;