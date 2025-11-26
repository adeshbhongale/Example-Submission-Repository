import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const Login = ({ show, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (err) => {
      alert(err.graphQLErrors?.[0]?.message || "Login failed");
    },
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  });

  if (!show) return null;

  const submit = async (e) => {
    e.preventDefault();
    await login({ variables: { username, password } });

    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
