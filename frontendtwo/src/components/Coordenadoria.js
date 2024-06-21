import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

// Estilos do Grid
const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  max-width: 1600px;
  margin: 20px auto;
`;

const Thead = styled.thead``;
const Tbody = styled.tbody``;
const Tr = styled.tr``;
const Th = styled.th`
  text-align: center;
  border-bottom: inset;
  padding-bottom: 5px;
`;
const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "center")};
  width: ${(props) => (props.width ? props.width : "auto")};
`;
const TdIcon = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "center")};
  width: ${(props) => (props.width ? props.width : "auto")};
  background-color: #fff;
  cursor: pointer;
`;

// Estilos do Form
const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;
const StyledSelect = styled.select`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;
const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => (props.type === "clean" ? "black" : "green")};
  color: white;
  height: 42px;
`;

// Componente combinado
const CoordenadoriaGrid = ({ getCoordenadorias, onEdit, setOnEdit, coordenadorias, setCoordenadorias }) => {
  const Title = styled.h2``;
  const ref = useRef();
  const [coordenadoriaColors, setCoordenadoriaColors] = useState({});

  useEffect(() => {
    axios
      .get("http://10.22.48.151:8801/coordenadorias")
      .then((response) => {
        const sortedCoordenadorias = response.data.sort((a, b) => (a.nome > b.nome ? 1 : -1));
        setCoordenadorias(sortedCoordenadorias);
      })
    
      .catch((error) => {
        console.error("Erro ao buscar coordenadorias:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    if (onEdit) {
      const coordenadoria = ref.current;

      coordenadoria.Nome.value = onEdit.Nome;
      coordenadoria.Status.value = onEdit.Status;
    }
  }, [onEdit,setCoordenadorias]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const coordenadoria = ref.current;

    if (!coordenadoria.Nome.value || !coordenadoria.Status.value) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios
        .put("http://10.22.48.151:8801/coordenadorias/" + onEdit.IdCoordenadoria, {
          Nome: coordenadoria.Nome.value,
          Status: coordenadoria.Status.value === "true" ? 1 : 0,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://10.22.48.151:8801/coordenadorias", {
          Nome: coordenadoria.Nome.value,
          Status: coordenadoria.Status.value === "true" ? 1 : 0,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    coordenadoria.Nome.value = "";
    coordenadoria.Status.value = "";

    setOnEdit(null);
    getCoordenadorias();
  };

  const handleClear = () => {
    const coordenadoria = ref.current;

    coordenadoria.Nome.value = "";
    coordenadoria.Status.value = "";

    setOnEdit(null);
    toast.info("Os campos foram limpos!");
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (IdCoordenadoria) => {
    await axios
      .delete("http://10.22.48.151:8801/coordenadorias/" + IdCoordenadoria)
      .then(({ data }) => {
        const newArray = coordenadorias.filter((coordenadoria) => coordenadoria.IdCoordenadoria !== IdCoordenadoria);

        setCoordenadorias(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));

    setOnEdit(null);
  };

  useEffect(() => {
    // Gerar cores com base nos nomes únicos das coordenadorias
    const generateColor = () => {
      const letters = "ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
      }
      return color;
    };

    const updatedColors = { ...coordenadoriaColors };

    coordenadorias.forEach((coordenadoria) => {
      if (!updatedColors[coordenadoria.Nome]) {
        updatedColors[coordenadoria.Nome] = generateColor();
      }
    });

    setCoordenadoriaColors(updatedColors);
  }, [coordenadorias, coordenadoriaColors]);

  return (
    <>
      <Title>Coordenadorias</Title>
      <FormContainer ref={ref} onSubmit={handleSubmit}>
        <InputArea>
          <Label>Nome</Label>
          <Input name="Nome" />
        </InputArea>
        <InputArea>
          <Label>Status</Label>
          <StyledSelect name="Status">
            <option value="false">Desativo</option>
            <option value="true">Ativo</option>
          </StyledSelect>
        </InputArea>
        <Button type="submit">Salvar</Button>
        <Button type="clean" onClick={handleClear}>
          Limpar
        </Button>
      </FormContainer>

      <Table>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {coordenadorias.map((item, i) => (
            <Tr key={i} style={{ background: coordenadoriaColors[item.Nome] }}>
              <Td width="30%">{item.Nome}</Td>
              <Td width="30%">{item.Status === 1 ? "Ativo" : "Desativado"}</Td>
              <TdIcon alignCenter width="5%">
                <FaEdit onClick={() => handleEdit(item)} />
              </TdIcon>
              <TdIcon alignCenter width="5%">
                <FaTrash onClick={() => handleDelete(item.IdCoordenadoria)} />
              </TdIcon>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default CoordenadoriaGrid;
