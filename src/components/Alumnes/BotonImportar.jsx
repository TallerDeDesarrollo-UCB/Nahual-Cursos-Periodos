import React, { Component, Fragment } from 'react';
import { Button, Modal, Grid, } from 'semantic-ui-react';
import { CSVReader } from "react-papaparse"
import "moment/locale/es";
import axios from 'axios';
import servicionotificacion from "../../servicios/notificaciones";
import Previsualizar from './PrevisualizarTabla'
import BotonConfirmarInscriptes from './BotonConfirmarInscriptes';

var listaNodos = [];
var listaSedes = [];
var listaEstudiantes = [];

const findNodo = (datos, nodo) => {

  if (datos.find(el => el === nodo)) {
    return true
  }
  return false;
}


const findSede = (data, sede) => {
  if (data.find(el => el === sede)) {
    return true
  }
  return false;
}


const findEstudiante = (listaEstudiantes, correo, numero) => {
  var estudiante = listaEstudiantes.find(el => el.correo === correo && el.celular === numero)
  if (estudiante !== undefined) {
    return estudiante
  }
  else {
    return null
  }
}

const URL_Estudiantes = `${process.env.REACT_APP_API_URL}/egresades/`;
const URL_Inscriptos = `${process.env.REACT_APP_API_URL}/inscriptos/`;

class BotonImportar extends Component {
  obtenerNodosYSedes = async () => {
    const API_URL = `${process.env.REACT_APP_API_URL}/nodos/`;
    await
      axios
        .get(`${API_URL}`)
        .then(response => {
          this.setState({
            respuestaNodos: response.data.response
          });
          this.state.respuestaNodos.forEach(function (element) {
            listaNodos.push(element.nombre)
            element.sedes.forEach(function (element) {
              listaSedes.push(element.nombre)
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  obtenerEstudiantes = async () => {
    const API_URL = `${process.env.REACT_APP_API_URL}/estudiantes/`;
    await
      axios
        .get(`${API_URL}`)
        .then(response => {
          this.setState({
            respuestaEstudiantes: response.data.response
          });
          this.state.respuestaEstudiantes.forEach(function (element) {
            listaEstudiantes.push(element)
          });
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  constructor(props) {
    super(props);
    this.obtenerNodosYSedes()
    this.obtenerEstudiantes()
    this.state = {
      result: 0,
      open: false,
      inscriptes: [],
      contandorInscriptes: 0,
      mostrarLista: false,
      respuestaNodos: [],
      curso: this.props.cursoActual
    };
    this.mostrarTabla = this.mostrarTabla.bind(this);
  }

  abrirModal(estado) {
    this.setState({
      open: estado,
      mostrarLista: false,
      inscriptes: [],
      contandorInscriptes: 0
    })
  }

  mostrarTabla = (data) => {
    this.setState({
      mostrarLista: true,
    });
  }

  getDate(date) {
    if (date) {
      let splittedDate = date.split("/");
      let preparedDate = splittedDate[1] + '/' + splittedDate[0] + '/' + splittedDate[2];
      return preparedDate;
    } else {
      return null;
    }
  }


  incrementarContadorInscriptes() {
    this.setState({ contandorInscriptes: this.state.contandorInscriptes + 1 })
  }

  onSubmit = async (onRegistrarCorrectamente) => {
    let curso = this.props.cursoActual;
    let lista = this.state.inscriptes;
    let listaNueva = [];
    const API_URL = `${process.env.REACT_APP_API_URL}/cursos/${curso}/inscriptes`;
    await
      axios
        .get(`${API_URL}`)
        .then(response => {
          listaNueva = response.data.response;
          listaNueva.forEach(inscripte => {
            axios
              .delete(`${process.env.REACT_APP_API_URL}/estudiantes/${inscripte.estudiante.id}?curseId=${curso}`)
          })
        })
        .catch(function (error) {
          console.log(error);
        });
    if (lista.length > 0) {
      lista.forEach(inscripte => {
        var nuevoInscripte = {
          "estudianteId": inscripte.id,
          "cursoId": curso
        }
        fetch(`${URL_Inscriptos}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(nuevoInscripte).length.toString()
          },
          body: JSON.stringify(nuevoInscripte)
        }).then(response => {
          if (response.status == 200) {
            servicionotificacion.mostrarMensajeExito(
              "CSV importado con éxito",
              `Se añadio alumnes con exito`
            );
            window.location.reload(true);
          } else {
            servicionotificacion.mostrarMensajeError(
              "Fallo importacion de CSV",
              `Estado de la peticion: ${response.status}`
            );
          }
        })
          .catch(function (error) {
            servicionotificacion.mostrarMensajeError(
              "Algo salio mal al hacer la peticion",
              `Ver detalles en la consola del navegador`
            );
            console.log(error);
          });
      });
    }
    else {
      servicionotificacion.mostrarMensajeError(
        "Importacion fallida",
        `Revise los datos del CSV`
      );
    }
    this.abrirModal(false)
  }

  handleOnDrop = (data) => {
    this.obtenerEstudiantes()
    data.forEach(fila => {
      var nodo = fila.data["NODO"]
      var sede = fila.data["SEDE"]
      var correo = fila.data["Mail"]
      var numero = fila.data["Numero de Celular"]
      var estudiante = findEstudiante(listaEstudiantes, correo, numero)
      if (estudiante !== null) {
        if ((findNodo(listaNodos, nodo)) && (findSede(listaSedes, sede))) {
          var inscripte = {
            "id": estudiante.id,
            "nombre": estudiante.nombre,
            "apellido": estudiante.apellido,
            "estadoId": 1,
            "fechaNacimiento": estudiante.fechaNacimiento,
            "correo": estudiante.correo,
            "celular": estudiante.celular,
            "nodoId": estudiante.nodoId,
            "sedeId": estudiante.sedeId,
            "añoGraduacion": estudiante.añoGraduacion,
            "cuatrimestre": estudiante.cuatrimestre,
            "nivelInglesId": estudiante.nivelInglesId,
            "nombrePrimerTrabajo": estudiante.nombrePrimerTrabajo,
            "linkedin": estudiante.linkedin,
            "esEmpleado": estudiante.esEmpleado,
            "modulo": estudiante.modulo,
            "zona": estudiante.zona,
            "dni": estudiante.dni,
            "nacionalidad": estudiante.nacionalidad,
            "trabajaActualmente": estudiante.trabajaActualmente,
            "trabajaSistemas": estudiante.trabajaActualmente,
            "experienciaSistemas": estudiante.experienciaSistemas,
            "estudiosSistemas": estudiante.estudiosSistemas,
            "correoOpcional": estudiante.correoOpcional,
            "detalle": estudiante.detalle,
            "fechaActualTrabajo": estudiante.fechaActualTrabajo,
            "lugarActualTrabajo": estudiante.lugarActualTrabajo,
            "fechaPrimerEmpleo": estudiante.fechaPrimerEmpleo
          }
          this.state.inscriptes.push(inscripte)
          this.incrementarContadorInscriptes()
        }
        this.mostrarTabla()
      }
    })
  }

  handleOnError = (err) => {
    console.log(err)
  }

  handleOnRemoveFile = () => {
    this.setState({ mostrarLista: false, inscriptes: [], contandorInscriptes: 0 });
  }
  getResponse(result) {
    this.abrirModal(false)
    console.log(result);
  }
  register = (result) => {
    if (result === "confirmed") {
      this.onSubmit();

    }
  }

  render() {
    return (
      <Modal
        open={this.state.open}
        onClose={() => this.abrirModal(false)}
        onOpen={() => this.abrirModal(true)}
        closeIcon
        centered={true}
        trigger={
          <Button floated="left" color="green" content="Importar" icon="upload">
          </Button>}>
        {
          <Fragment>
            <Modal.Header>
              <Grid>
                <Grid.Column>
                  <h2>Importar Inscriptes</h2>
                </Grid.Column>
              </Grid>
            </Modal.Header>

            <Modal.Content>
              <Modal.Description>
                <CSVReader
                  cssClass="csv-reader-input"
                  config={{
                    header: true,
                    skipEmptyLines: 'greedy'
                  }}
                  onDrop={this.handleOnDrop}
                  onError={this.handleOnError}
                  addRemoveButton
                  onRemoveFile={this.handleOnRemoveFile}>
                  <span>Arrastra el archivo CSV aqui.</span>
                  <p> El CSV tiene que tener las cabeceras de "Numero de Celular" y "Mail" para importar</p>
                </CSVReader>
              </Modal.Description>
              {this.state.mostrarLista && this.state.inscriptes !== [] ?
                <Previsualizar json={this.state.inscriptes} />
                :
                <h1 align="center">No se cargo ningun archivo</h1>}

            </Modal.Content>
          </Fragment>
        }
        <Modal.Actions>
          <Button className="cancelButton" onClick={() => this.abrirModal(false)}>Cerrar</Button>
          <BotonConfirmarInscriptes onRegister={this.register}></BotonConfirmarInscriptes>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default BotonImportar
