import React, {useEffect, useState} from "react";
import { Button } from "shards-react";
import { obtenerPeriodos, obtenerCursosPorIdPeriodo } from "../servicios/periodos";
import { Link } from "react-router-dom"
import ListarCursosGuardados from "./listarCursosGuadados";
import styles from "./styles.module.css";


export default function Periodos() {
    const [periodos, setPeriodos] = useState([])
    const [filtroEstado, setFiltroEstado] = useState(true);
    const [cursosAMostrar, setCursosAMostrar] = useState([]);
    const [informacionListaCursos, setInformacionListaCursos] = useState(false)
    const [idPeriodo, setIdPeriodo] = useState(0)

    useEffect(() => {
        obtenerPeriodos().then(response => response.json()).then(response => setPeriodos(response.response))
    }, [])
    return (
        <div className={styles.vistaPeriodos}>
            <div className={'opcionesPeriodo'}>
                <div className={"selectBar"}>
                    <select className={"custom-select"} onChange={(x) => {setFiltroEstado(x.target.value === 'true')}}>
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                    </select>   
                </div>
            <h1>Periodos</h1>
            <Link to="/formulario-registro-periodo" className={'linkElement'}>Nuevo Periodo</Link>
            </div>
            <ListarCursosGuardados cursos={cursosAMostrar} estaAbierto={informacionListaCursos} setAbierto={setInformacionListaCursos} idPeriodo={idPeriodo}/>
            <table className={"table"}>
                    <thead className={"thead-dark"}>
                        <tr>
                        <th scope="col">Periodo</th>
                        <th scope="col">Año</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Topico</th>
                        <th scope="col"><div className={'displayFlex centered'}>Acciones</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {periodos.map(p => {
                            if (p.estado == filtroEstado){
                                return (
                                <tr key={`periodo-${p.id}`}>
                                    <td>{p.periodo}</td>
                                    <td>{p.anio}</td>
                                    <td>{p.estado ? 'Activo':'Inactivo'}</td>
                                    <td>{p.topico.nombre}</td>
                                    <td>
                                        <div className={'displayFlex centered columnGap'}>
                                                <Button theme="success" onClick={x => {
                                                    obtenerCursosPorIdPeriodo(p.id).then(cursoperiodo => {
                                                        return cursoperiodo.json()
                                                    }).then(cursoperiodo => {
                                                        setCursosAMostrar(cursoperiodo.response)
                                                        setInformacionListaCursos(true)
                                                        setIdPeriodo(p.id);
                                                    })
                                                }} >Ver cursos</Button>
                                                <Button theme="danger">Eliminar</Button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            }
                        })}
                    </tbody>
            </table>
        </div>
    )
}