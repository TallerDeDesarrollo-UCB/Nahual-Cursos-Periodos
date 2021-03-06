import React, { useEffect, useState } from "react";
import { obtenerSedesPorIdNodo } from "../../servicios/nodos";
import { Label, Table } from 'semantic-ui-react'
import styles from "../styles.module.css";

export default function ListaSedes({ nodoId, nodoNombre }) {
    const [sedes, setSedes] = useState([]);

    const obtener = () => {
        obtenerSedesPorIdNodo(nodoId).then(sedeNodo => {
            return sedeNodo.json();
        }).then(sedeNodo => {
            setSedes(sedeNodo.response);
        })
    }

    useEffect(() => {
        obtener();
    }, []);

    const mystyle = {
        
        padding: "12%",
        width:"100%"
      };

    const listaDeSedes = <div>
        {sedes.map(sede => {
            return (
                <div>
                    <Table.Cell style={mystyle}>
                            <Label className={styles.sede}>• {sede.nombre}</Label>
                    </Table.Cell>
                </div>
            )
        })}
    </div>;
    return (
        <div>
            {sedes.length > 0 ? listaDeSedes : <h4>El nodo no tiene sedes</h4>}
        </div>
    )
}