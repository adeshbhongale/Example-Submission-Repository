import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS);
  const [genre, setGenre] = useState(null);

  if (!show) return null;
  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data.allBooks;

  // Extract unique genres from all books
  const allGenres = [...new Set(books.flatMap((b) => b.genres))];

  // Filter books
  const filteredBooks = genre
    ? books.filter((b) => b.genres.includes(genre))
    : books;

  return (
    <div>
      <h2>Books</h2>

      {genre ? <p>Books in genre: <b>{genre}</b></p> : <p>All Genres</p>}

      <table border="1" cellPadding="6">
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>

        <tbody>
          {filteredBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <div>
        {allGenres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}

        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
