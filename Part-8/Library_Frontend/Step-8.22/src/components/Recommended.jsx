import { useQuery } from "@apollo/client";
import { ME, BOOKS_BY_GENRE } from "../queries";

const Recommended = ({ show }) => {
  const meResult = useQuery(ME);

  const favoriteGenre = meResult.data?.me?.favoriteGenre;

  const booksResult = useQuery(BOOKS_BY_GENRE, {
    skip: !favoriteGenre,
    variables: { genre: favoriteGenre }
  });

  if (!show) return null;
  if (meResult.loading) return <p>Loading user...</p>;

  if (!favoriteGenre) return <p>No favorite genre set.</p>;
  if (booksResult.loading) return <p>Loading books...</p>;

  const books = booksResult.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>

      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>

        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;

