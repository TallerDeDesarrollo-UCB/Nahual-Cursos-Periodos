import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Cursos from "./components/Cursos/cursos";
import ListarNodos from "./components/Nodos/listarNodos";
import { Container, Message, Icon } from "semantic-ui-react";
import ListaDeAlumnesPorCurso from "./components/Alumnes/ListaDeAlumnesPorCurso";
import Encabezado from "./components/Layouts/Encabezado";
import "semantic-ui-less/semantic.less";
import styles from "./styles.module.css";
import PieDePagina from "./components/Layouts/PieDePagina"
import ValidarInicioSesion from "../src/components/Autenticacion/ValidarInicioSesion";
import ProtegerRuta from "./components/Autenticacion/ProtegerRuta";
import Topico from "./components/Topicos/topicos.jsx"
import EditarAlumne from "./components/Alumnes/EditarAlumne"

function App() {
  return (
    <Router>
      <div>
        <div id="mensaje-exito" className={styles.notificationMessage}>
          <Message icon color="green">
            <Icon name="check" />
            <Message.Content>
              <Message.Header>
                <p id="titulo-mensaje-exito"></p>
              </Message.Header>
              <p id="mensaje-exito-description"></p>
            </Message.Content>
          </Message>
        </div>
        <div id="mensaje-error" className={styles.notificationMessage}>
          <Message icon color="red">
            <Icon name="times circle outline" />
            <Message.Content>
              <Message.Header>
                <p id="titulo-mensaje-error"></p>
              </Message.Header>
              <p id="mensaje-error-description"></p>
            </Message.Content>
          </Message>
        </div>
        <Container  style={{paddingBottom:"200px", minHeight: "100vh"}}>
          <Encabezado />
          <div className="app">
            <div className="app__sidebar" />
            <main className="app__content">
              <Switch>
                 <ProtegerRuta
                  exact
                  path="/cursos"
                  component={Cursos}
                />
                <ProtegerRuta 
                  exact 
                  path="/nodos" 
                  component={ListarNodos} />
                <ProtegerRuta
                  exact
                  path="/alumnes"
                  component={ListaDeAlumnesPorCurso}
                />
                <ProtegerRuta
                  exact
                  path="/alumne/:id"
                  component={EditarAlumne}
                />
                <ProtegerRuta
                  exact
                  path="/topicos"
                  component={Topico}
                />
                <ProtegerRuta
                  exact
                  path="*"
                  component={ValidarInicioSesion}
                />
                <Route exact path="/" component={ValidarInicioSesion} />
              </Switch>
            </main>
          </div>
        </Container>
        <PieDePagina/>
      </div>
    </Router>
  );
}

export default App;
