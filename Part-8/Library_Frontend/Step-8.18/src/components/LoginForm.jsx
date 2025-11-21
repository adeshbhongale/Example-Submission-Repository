import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      alert(error.graphQLErrors[0]?.message);
    },
  });

  if (!show) return null;

  const submit = async (e) => {
    e.preventDefault();

    const result = await login({
      variables: { username, password },
    });

    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      setPage("authors");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          Username <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
