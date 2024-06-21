import React from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit} from "react-icons/fa";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";


const Table = styled.table`
    width: 100%;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 5px #ccc;
    border-radius: 5px;
    max-width: 1600px;
    margin: 20px auto;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th`
  text-align: center;
  border-bottom: inset;
  padding-bottom: 5px;
`;

export const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "center")};
  width: ${(props) => props.width ? props.width : "auto"};
`;

const TdIcon = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "center")};
  width: ${(props) => props.width ? props.width : "auto"};
  background-color: #fff; 
  cursor: pointer;
`;


const Grid = ({ users, setUsers, setOnEdit }) => {
    const handleEdit = (item) => {
        setOnEdit(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (IdRamal) => {
        await axios
        .delete("http://10.22.48.151:8801/" + IdRamal)
        .then(({data}) => {
            const newArray = users.filter((user) => user.IdRamal !== IdRamal);

            setUsers(newArray);
            toast.success(data);
        })
        .catch(({data}) => toast.error(data));

        
      
      setOnEdit(null);
    };

    const [coordenadoriaColors, setCoordenadoriaColors] = useState({});

  useEffect(() => {
    // Gerar cores mais claras (tons pastel)
    const generateColor = () => {
      const letters = "ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
      }
      return color;
    };

    const updatedColors = { ...coordenadoriaColors };

    users.forEach((user) => {
      if (!updatedColors[user.NomeCoordenadoria]) {
        updatedColors[user.NomeCoordenadoria] = generateColor();
      }
    });

    setCoordenadoriaColors(updatedColors);
  }, [users]);

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Nome</Th>
                    <Th>Coordenadoria</Th>
                    <Th>Unidade</Th>
                    <Th>Cargo</Th>
                    <Th>Numero</Th>
                    <Th>Status</Th>
                </Tr>
            </Thead>
            <Tbody>
                {users.map((item, i) => ( 
                    <Tr key={i} style={{ background: coordenadoriaColors[item.NomeCoordenadoria] }}>
                        <Td width="30%">{item.Nome}</Td>
                        <Td width="30%">{item.NomeCoordenadoria}</Td>
                        <Td width="30%">{item.NomeUnidade}</Td>
                        <Td width="30%">{item.NomeCargo}</Td>
                        <Td width="30%">{item.Numero}</Td>
                        <Td width="30%">{item.Status === 1 ? 'Ativo' : 'Desativado'}</Td>
                        <TdIcon alignCenter width="5%">
                        <FaEdit onClick={() => handleEdit(item)} />
                        </TdIcon>
                        <TdIcon alignCenter width="5%">
                        <FaTrash onClick={() => handleDelete(item.IdRamal)} />
                        </TdIcon>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default Grid;