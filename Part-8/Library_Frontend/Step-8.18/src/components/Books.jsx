import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
  if (!show) return null;

  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (loading) return <div>loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author?.name}</td>
              <td>{b.published}</td>
              <td>{b.genres.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
