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
const CargoGrid = ({ getCargos, onEdit, setOnEdit, cargos, setCargos }) => {
  const Title = styled.h2``;
  const ref = useRef();
  const [cargoColors, setCargoColors] = useState({});

  useEffect(() => {
    axios
      .get("http://10.22.48.151:8801/cargos")
      .then((response) => {
        const sortedCargos = response.data.sort((a, b) => (a.nome > b.nome ? 1 : -1));
        setCargos(sortedCargos);
      })
      .catch((error) => {
        console.error("Erro ao buscar cargos:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    if (onEdit) {
      const cargo = ref.current;

      cargo.Nome.value = onEdit.Nome;
      cargo.Status.value = onEdit.Status;
    }
  }, [onEdit, setCargos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cargo = ref.current;

    if (!cargo.Nome.value || !cargo.Status.value) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios
        .put("http://10.22.48.151:8801/cargos/" + onEdit.IdCargo, {
          Nome: cargo.Nome.value,
          Status: cargo.Status.value === "true" ? 1 : 0,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://10.22.48.151:8801/cargos", {
          Nome: cargo.Nome.value,
          Status: cargo.Status.value === "true" ? 1 : 0,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    cargo.Nome.value = "";
    cargo.Status.value = "";

    setOnEdit(null);
    getCargos();
  };

  const handleClear = () => {
    const cargo = ref.current;

    cargo.Nome.value = "";
    cargo.Status.value = "";

    setOnEdit(null);
    toast.info("Os campos foram limpos!");
  };


  const handleEdit = (item) => {
    setOnEdit(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (IdCargo) => {
    await axios
      .delete("http://10.22.48.151:8801/cargos/" + IdCargo)
      .then(({ data }) => {
        const newArray = cargos.filter((cargo) => cargo.IdCargo !== IdCargo);

        setCargos(newArray);
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

    const updatedColors = { ...cargoColors };

    cargos.forEach((cargo) => {
      if (!updatedColors[cargo.Nome]) {
        updatedColors[cargo.Nome] = generateColor();
      }
    });

    setCargoColors(updatedColors);
  }, [cargos, cargoColors]);

  return (
    <>
      <Title>Cargos</Title>
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
          {cargos.map((item, i) => (
            <Tr key={i} style={{ background: cargoColors[item.Nome] }}>
              <Td width="30%">{item.Nome}</Td>
              <Td width="30%">{item.Status === 1 ? "Ativo" : "Desativado"}</Td>
              <TdIcon alignCenter width="5%">
                <FaEdit onClick={() => handleEdit(item)} />
              </TdIcon>
              <TdIcon alignCenter width="5%">
                <FaTrash onClick={() => handleDelete(item.IdCargo)} />
              </TdIcon>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default CargoGrid;
