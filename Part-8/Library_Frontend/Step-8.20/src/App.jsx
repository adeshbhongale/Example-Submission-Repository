import React, { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import Recommended from './components/Recommended'; 

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(localStorage.getItem("library-user-token"));

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    setPage("login");
  };

  return (
    <div>
      {/* NAVIGATION BAR */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {!token && <button onClick={() => setPage("login")}>login</button>}

        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommended")}>recommended</button>

            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      {/* PAGES */}
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken} />
      <Recommended show={page === "recommended"}/>
    </div>
  );
};

export default App;
