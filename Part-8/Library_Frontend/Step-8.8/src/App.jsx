import { useState } from "react";
import Authors from "./components/Authors";

const App = () => {
  const [page, setPage] = useState("authors");

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
      </div>

      <Authors show={page === "authors"} />
    </div>
  );
};

export default App;
