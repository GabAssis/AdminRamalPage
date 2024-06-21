import GlobalStyle from "./styles/global";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import FormGrid from "./components/FormGrid";
import CoordenadoriaGrid from "./components/Coordenadoria.js";
import UnidadeGrid from "./components/UnidadeGrid.js";
import CargoGrid from "./components/CargoGrid.js";
import Menu from "./components/Menu.js";
import Header from "./components/Header";
import Login from "./components/Login.js";

export const controlador = 0;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

function App() {
  const [users, setUsers] = useState([]);
  const [coordenadorias, setCoordenadorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  useEffect(() => {
    getUsers();
    getCoordenadorias();
    getUnidades();
    getCargos();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get("http://10.22.48.151:8801/");
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  const getCoordenadorias = async () => {
    try {
      const res = await axios.get("http://10.22.48.151:8801/coordenadorias");
      setCoordenadorias(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  const getUnidades = async () => {
    try {
      const res = await axios.get("http://10.22.48.151:8801/unidades");
      setUnidades(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  const getCargos= async () => {
    try {
      const res = await axios.get("http://10.22.48.151:8801/cargos");
      setCargos(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleLogout = () => {
    // Limpar o token ao fazer logout
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {token ? (
            <Redirect to="/menu" />
          ) : (
            <Login setToken={setToken} />
          )}
        </Route>

        {/* Rotas protegidas com Header */}
        <PrivateRoute path="/ramalcrud">
          <Header onLogout={handleLogout} />
          <Container>
            <FormGrid
              onEdit={onEdit}
              setOnEdit={setOnEdit}
              getUsers={getUsers}
              users={users}
              setUsers={setUsers}
            />
          </Container>
        </PrivateRoute>

        <PrivateRoute path="/coordenadoriacrud">
          <Header onLogout={handleLogout} />
          <Container>
            <CoordenadoriaGrid
              onEdit={onEdit}
              setOnEdit={setOnEdit}
              getCoordenadorias={getCoordenadorias}
              coordenadorias={coordenadorias}
              setCoordenadorias={setCoordenadorias}
            />
          </Container>
        </PrivateRoute>

        <PrivateRoute path="/unidadecrud">
          <Header onLogout={handleLogout} />
          <Container>
            <UnidadeGrid
              onEdit={onEdit}
              setOnEdit={setOnEdit}
              getUnidades={getUnidades}
              unidades={unidades}
              setUnidades={setUnidades}
            />
          </Container>
        </PrivateRoute>

        <PrivateRoute path="/cargocrud">
          <Header onLogout={handleLogout} />
          <Container>
            <CargoGrid
              onEdit={onEdit}
              setOnEdit={setOnEdit}
              getCargos={getCargos}
              cargos={cargos}
              setCargos={setCargos}
            />
          </Container>
        </PrivateRoute>

        <PrivateRoute path="/menu">
          <Header onLogout={handleLogout} />
          <Menu />
        </PrivateRoute>
        {/* ... Outras rotas protegidas ... */}

      </Switch>
      <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} />
      <GlobalStyle />
    </Router>
  );
}

// Componente PrivateRoute para verificar autenticação
const PrivateRoute = ({ children, ...rest }) => {
  const token = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={({ location }) =>
        token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default App;
