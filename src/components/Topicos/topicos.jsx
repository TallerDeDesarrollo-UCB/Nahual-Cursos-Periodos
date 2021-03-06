import React, { useEffect, useState } from 'react';
import { Button, Table, Icon, Header } from "semantic-ui-react";
import {obtenerTopicos} from '../../servicios/topicos';
import './topicos.css'
import NuevoTopico from './nuevoTopico';
import EliminarTopico from './EliminarTopico';
import EditarTopico from './editarTopico'
import styles from "../styles.module.css";

export default function Topicos() {
    const [topicos, setTopicos] = useState([]);
    const [topicSelected, setTopicSelected] = useState({id:'',nombre:''});
    const [isOpenModalEditTopic, setIsOpenModalEditTopic] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalDeletTopic, setIsOpenModalDeletTopic] = useState(false);
    useEffect(() => {
        fetchDataTopics();
    }, []);
   

    const fetchDataTopics = () => {
        obtenerTopicos()
        .then((response) => setTopicos(response.data.response));
        console.log(topicos);
    }

    const listaPeriodos = <Table>
    <Table.Header>
      <Table.Row>
      <Table.HeaderCell>N°</Table.HeaderCell>
        <Table.HeaderCell>Tópico</Table.HeaderCell>
        <Table.HeaderCell className={"displayFlex  centered"}>
          Acciones
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
       {topicos.map((topico,index) => {
        
          return (
          
            <Table.Row key={`topico-${topico.id}`}>
              <Table.Cell>{index+1}</Table.Cell>
              <Table.Cell>{topico.nombre}</Table.Cell>
              <Table.Cell>
                <div className={"displayFlex centered columnGap"}>
                  <Button
                    color="yellow"
                    onClick={() => {
                        setTopicSelected({id:topico.id,nombre:topico.nombre});
                        setIsOpenModalEditTopic(true);
                        
                    }}
                  >
                    Editar <Icon color='white' name='edit' style={{ margin: '0 0 0 10px' }} />
                  </Button>
                  <Button
                    color="red"
                    onClick={() => {
                        setTopicSelected(topico);
                        setIsOpenModalDeletTopic(true);
                    }}
                  >
                    Eliminar <Icon color='white' name='edit' style={{ margin: '0 0 0 10px' }} />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        
      })} 
    </Table.Body>
  </Table>

    return (
        <>
        <div className={styles.vistaCursos}>
          <Header as='h1' icon textAlign='center'>
            <Icon name='code' size='tiny' circular  />
            <Header.Content>Topicos</Header.Content>
          </Header>
          <div className={styles.crearNodoButton}>
            <Button floated="right"  color='green'  onClick={() => {setIsOpenModal(true)}}>
              Topico
              <Icon color='white' name='add circle' style={{ margin: '0 0 0 10px',}} />
            </Button>
          </div>
        </div>
        {listaPeriodos}
        <NuevoTopico isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} updateTopicsTable={fetchDataTopics}/>
        <EliminarTopico isOpenModalDeletTopic={isOpenModalDeletTopic} setIsOpenModalDeletTopic={setIsOpenModalDeletTopic} topic={topicSelected} updateTopicsTable={fetchDataTopics}/>
        {isOpenModalEditTopic ? <EditarTopico isOpenModalEditTopic={isOpenModalEditTopic}  setIsOpenModalEditTopic={setIsOpenModalEditTopic}  updateTopicsTable={fetchDataTopics} topic={topicSelected} /* setTopic={setTopicSelected} */ /> : null}
        </>
    )
}
