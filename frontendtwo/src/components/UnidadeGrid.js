import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

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
  background-color: ${(props) => props.bgColor || "transparent"}; // Adicionado o estilo para a cor de fundo
`;
const TdIcon = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "center")};
  width: ${(props) => (props.width ? props.width : "auto")};
  background-color: #fff;
  cursor: pointer;
`;

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

const UnidadeGrid = ({ getUnidades, onEdit, setOnEdit, unidades, setUnidades }) => {
  const [coordenadorias, setCoordenadorias] = useState([]);
  const [coordenadoriaColors, setCoordenadoriaColors] = useState({});
  const Title = styled.h2``;
  const ref = useRef();

 
    
  useEffect(() => {
    axios
      .get("http://10.22.48.151:8801/unidades")
      .then((response) => {
        const sortedUnidades = response.data.sort((a, b) => (a.nome > b.nome ? 1 : -1));
      setUnidades(sortedUnidades);
    })
      .catch((error) => {
        console.error("Erro ao buscar unidades:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    axios
      .get("http://10.22.48.151:8801/coordenadoriasativas")
      .then((response) => {
        setCoordenadorias(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar coordenadorias:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    if (onEdit) {
      const unidade = ref.current;

      unidade.Nome.value = onEdit.Nome;
      unidade.EH.value = onEdit.EH;
      unidade.IdCoordenadoria.value = onEdit.IdCoordenadoria;
      unidade.Sigla.value = onEdit.Sigla;
      unidade.Status.value = onEdit.Status;
    }
  }, [onEdit, setUnidades]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const unidade = ref.current;

    const ehValue = unidade.EH.value;
    if (ehValue.length !== 15) {
      return toast.warn("O campo EH deve ter exatamente 15 caracteres!");
    }


    if (!unidade.Nome.value || !unidade.Status.value || !unidade.IdCoordenadoria.value || !unidade.EH.value) {
      return toast.warn("Preencha todos os campos!");
    }
    if (onEdit) {
      await axios
        .put("http://10.22.48.151:8801/unidades/" + onEdit.IdUnidade, {
          Nome: unidade.Nome.value,
          EH: unidade.EH.value,
          IdCoordenadoria: unidade.IdCoordenadoria.value,
          Sigla: unidade.Sigla.value,
          Status: unidade.Status.value === "true" ? 1 : 0,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://10.22.48.151:8801/unidades", {
          Nome: unidade.Nome.value,
          EH: unidade.EH.value,
          IdCoordenadoria: unidade.IdCoordenadoria.value,
          Sigla: unidade.Sigla.value,
          Status: unidade.Status.value === "true" ? 1 : 0,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    unidade.Nome.value = "";
    unidade.EH.value = "";
    unidade.IdCoordenadoria.value = "";
    unidade.Sigla.value = "";
    unidade.Status.value = "";

    setOnEdit(null);
    getUnidades();
  };

  const handleClear = () => {
    const unidade = ref.current;

    unidade.Nome.value = "";
    unidade.EH.value = "";
    unidade.IdCoordenadoria.value = "";
    unidade.Sigla.value = "";
    unidade.Status.value = "";

    setOnEdit(null);
    toast.info("Os campos foram limpos!");
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (IdUnidade) => {
    await axios
      .delete("http://10.22.48.151:8801/unidades/" + IdUnidade)
      .then(({ data }) => {
        const newArray = unidades.filter((unidade) => unidade.IdUnidade !== IdUnidade);

        setUnidades(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));

    setOnEdit(null);
  };

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

    unidades.forEach((user) => {
      if (!updatedColors[user.NomeCoordenadoria]) {
        updatedColors[user.NomeCoordenadoria] = generateColor();
      }
    });

    setCoordenadoriaColors(updatedColors);
  }, [unidades, coordenadoriaColors]);

  return (
    <>
      <Title>Unidades</Title>
      <FormContainer ref={ref} onSubmit={handleSubmit}>
        <InputArea>
          <Label>Nome</Label>
          <Input name="Nome" />
        </InputArea>
        <InputArea>
          <Label>EH</Label>
          <Input name="EH" />
        </InputArea>
        <InputArea>
          <Label>Coordenadoria</Label>
          <StyledSelect name="IdCoordenadoria">
            {coordenadorias.map((coordenadoria) => (
              <option
                key={coordenadoria.IdCoordenadoria}
                value={coordenadoria.IdCoordenadoria}
              >
                {coordenadoria.Nome}
              </option>
            ))}
          </StyledSelect>
        </InputArea>
        <InputArea>
          <Label>Sigla</Label>
          <Input name="Sigla" />
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
            <Th>EH</Th>
            <Th>Coordenadoria</Th>
            <Th>Sigla</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {unidades.map((item, i) => (
            <Tr key={i}bgColor={coordenadoriaColors[item.NomeCoordenadoria]}>
              <Td width="30%" >
                {item.Nome}
              </Td>
              <Td width="30%">{item.EH}</Td>
              <Td width="30%">{item.NomeCoordenadoria}</Td>
              <Td width="30%">{item.Sigla}</Td>
              <Td width="30%">{item.Status === 1 ? "Ativo" : "Desativado"}</Td>
              <TdIcon alignCenter width="5%">
                <FaEdit onClick={() => handleEdit(item)} />
              </TdIcon>
              <TdIcon alignCenter width="5%">
                <FaTrash onClick={() => handleDelete(item.IdUnidade)} />
              </TdIcon>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default UnidadeGrid;
