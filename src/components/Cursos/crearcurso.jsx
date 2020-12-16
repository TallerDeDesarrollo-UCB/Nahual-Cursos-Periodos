import React, { useEffect, useState } from "react";
import { Button, Modal, Form, TextArea, Icon,Grid, Image } from "semantic-ui-react";
import { obtenerSedes } from "../../servicios/sedes";
import { crearCurso, obtenerCursoPorId } from "../../servicios/cursos";
import LogoNahual from '../../assets/logo-proyecto-nahual.webp'
import servicioNotificacion from "../../servicios/notificaciones";

export default function CrearCurso({estaAbierto, setAbierto, idPeriodo, cursos, setCursos }) {
  const [sedes, setSedes] = useState([]);
  const [horario, setHorario] = useState("");
  const [sedeNodo, setSedeNodo] = useState(null);
  const [nota, setNota] = useState("");
  const [profesor, setProfesor] = useState("");
  const [validacionProfesor, setValidacionProfesor] = useState(false)
  const [validacionNota, setValidacionNota] = useState(false)
  const [validacionNodo, setValidacionNodo] = useState(false)
  const [validacionHorario, setValidacionHorario] = useState(false)
  const [habilitado, setHabilitado] = useState(false)
  function inicializarSedes() {
    obtenerSedes()
      .then((response) => response.json())
      .then((response) => {
        setSedes(response.response);
        setSedeNodo({
          SedeId: response.response[0].id,
          NodoId: response.response[0].NodoId,
        });
      });
  }

  function resetValores() {
    setHorario("");
    inicializarSedes();
    setNota("");
    setProfesor("");
    setAbierto(!estaAbierto);
    setHabilitado(false);
    setValidacionNota(false);
    setValidacionNodo(false);
    setValidacionHorario(false);
    setValidacionProfesor(false);
  }
  useEffect(() => {
    inicializarSedes();
  }, []);

  function mostrarNotificacion(curso) { 
    servicioNotificacion.mostrarMensajeExito(
      "Curso creado con éxito",
      `Se creó el curso ${curso.horario}`
    );
  }

  function validarFormulario(data,tipo){
    switch(tipo){
      case "sede-nodo":
        setProfesor(data)
          setValidacionNodo(true)
      break;
      case "profesor":
        setProfesor(data)
        if(data.length != 0)
          setValidacionProfesor(true)
      break;
      case "nota":
        setNota(data)
        if(data.length != 0)
          setValidacionNota(true)
      break;
      case "horario":
        setHorario(data)
        if(data.length != 0)
          setValidacionHorario(true)
      break;
    }
    if(validacionProfesor && validacionHorario && validacionNota && validacionNodo){
      setHabilitado(true);
    }
  }

  return (
    <Modal closeIcon open={estaAbierto} onClose={() => setAbierto(!estaAbierto)}>
      <Modal.Header>
        <Grid columns='equal'>
          <Grid.Column>
            <Image src={LogoNahual} size='small' />
          </Grid.Column>
          <Grid.Column>
            Nuevo Curso
          </Grid.Column>
        </Grid>
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Select
            fluid
            label="Sede - Nodo"
            options={sedes.map((s) => {
              return {
                key: `sede-${s.id}`,
                value: [s.nodo.id, s.id],
                text: s.nombre + " - " + s.nodo.nombre,
              };
            })}
            onChange={(e, data) => {
              const selected = data.value;
              validarFormulario(data.value , "sede-nodo")
              setSedeNodo({
                SedeId: selected[1],
                NodoId: selected[0],
              });
            }}
          />
            <Form.Input
              label="Horario"
              fluid
              type="text"
              className={"form-control"}
              onChange={(x, data) => validarFormulario(data.value , "horario")}
            />
            <Form.Input
              label="Profesor"
              fluid
              type="text"
              class="form-control"
              onChange={(x, data) => validarFormulario(data.value , "profesor")}
            />
            <Form.Input
              label="Notas"
              fluid
              type="text"
              class="form-control"
              control={TextArea}
              onChange={(x, data) => validarFormulario(data.value , "nota")}
            />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          className="cancelButton"
          onClick={() => {
            resetValores();
            setAbierto(!estaAbierto);
          }}
        >
          Cancelar <Icon name="remove" style={{ margin: '0 0 0 10px' }}/>
        </Button>
        <Button
          className="confirmButton"
          color="green"
          disabled={!habilitado}
          onClick={() => {
            crearCurso({                
              ...sedeNodo,
              horario: horario,
              profesores: profesor,
              notas: nota,
              PeriodoId: idPeriodo
            })
              .then((x) => {
                return x.data;
              })
              .then((x) => {
                return x.result;
              })
              .then((x) => {
                return obtenerCursoPorId(x.id);
              })
              .then((x) => {
                return x.data.respuesta;
              })
              .then((x) => {
                setCursos([...cursos, x]);
                mostrarNotificacion(x);
              });
            resetValores();
          }}
        >
          Crear <Icon name="checkmark" style={{ margin: '0 0 0 10px' }}/>
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
