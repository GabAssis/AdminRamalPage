import React, { useState } from "react";
import styled from "styled-components";

const userLogin = process.env.REACT_APP_USER
const userPass = process.env.REACT_APP_PASS

const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin: 10px 0 5px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 5px 0 20px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    // Verificar as credenciais
    if (username === userLogin && password === userPass) {

      const token = "seu_token_gerado"; 

      setToken(token);
      localStorage.setItem("token", token);
    } else {
      alert("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <LoginContainer>
      <Heading>Login</Heading>
      <Form id="form" onSubmit={handleLogin}>
        <Label>Usuário:</Label>
        <Input
          type="text"
          id="username"
          placeholder="Seu usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Label>Senha:</Label>
        <Input
          type="password"
          id="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Entrar</Button>
      </Form>
    </LoginContainer>
  );
};

export default Login;
