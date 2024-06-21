import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "react-modal";
import { FaEdit, FaCheckSquare, FaSquare, FaFilePdf, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

Modal.setAppElement('#root');

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
const Tr = styled.tr`
  cursor: pointer;
`;
const Th = styled.th`
  text-align: center;
  border-bottom: inset;
  padding-bottom: 5px;
  cursor: pointer;
`;
const Td = styled.td`
  padding-top: 15px;
  text-align: center;
  width: auto;
`;
const TdIcon = styled.td`
  padding-top: 15px;
  text-align: center;
  width: auto;
  background-color: inherit; /* Maintain background color */
  cursor: pointer;
`;

// Estilos do Form
const FormContainer = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: ${props => props.large ? '300px' : '120px'}; /* Ajuste a largura aqui */
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const StyledSelect = styled.select`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => {
    if (props.id === "clear") return "#1E90FF"; // Azul do porto
    if (props.type === "submit") return "#43d9a4";
    if (props.id === "edit") return "#185923";
    if (props.id === "filter") return "#152a52"; 
    if (props.id === "pdf") return "red";
  }};
  color: white;
  height: 42px;
`;

const Title = styled.h2``;

const FormGrid = ({ getUsers, onEdit, setOnEdit, users, setUsers }) => {
  const ref = useRef();
  const [coordenadorias, setCoordenadorias] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [coordenadoriaColors, setCoordenadoriaColors] = useState({});
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterName, setFilterName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterCoord, setFilterCoord] = useState("");
  const [filterStatusSelector, setFilterStatusSelector] = useState("");
  const [formData, setFormData] = useState({
    Nome: "",
    IdCoordenadoria: "",
    IdUnidade: "",
    IdCargo: "",
    Numero: "",
    Status: ""
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const sortByName = (data) => {
    return data.sort((a, b) => a.Nome.localeCompare(b.Nome));
  };

  useEffect(() => {
    axios
      .get("http://10.22.48.151:8801/coordenadoriasativas")
      .then((response) => {
        setCoordenadorias(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar coordenadorias:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    axios
      .get("http://10.22.48.151:8801/cargossativos")
      .then((response) => {
        setCargos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar cargos:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    axios
      .get("http://10.22.48.151:8801/unidadesativas")
      .then((response) => {
        setUnidades(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar unidades:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });
  }, []);

  useEffect(() => {
    if (onEdit) {
      setFormData({
        Nome: onEdit.Nome || "",
        IdCoordenadoria: onEdit.IdCoordenadoria || "",
        IdUnidade: onEdit.IdUnidade || "",
        IdCargo: onEdit.IdCargo || "",
        Numero: onEdit.Numero || "",
        Status: onEdit.Status === 1 ? "true" : "false"
      });
    }
  }, [onEdit]);

  useEffect(() => {
    axios
      .get("http://10.22.48.151:8801/")
      .then((response) => {
        const sortedData = sortByName(response.data);
        setUsers(sortedData);
        setAllUsers(sortedData);
        setFilteredUsers(sortedData);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });
  }, [setUsers]);

  useEffect(() => {
    const filtered = allUsers.filter((user) =>
      user.Nome.toLowerCase().includes(filterName.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [filterName, allUsers]);

  const stableSort = (data, field, order) => {
    const mappedData = [...data].map((row, index) => ({ row, index }));
    mappedData.sort((a, b) => {
      let comparison = a.row[field] < b.row[field] ? -1 : 1;
      if (comparison === 0 && field !== "Nome") {
        // If values are equal (except for Nome), use original index for stability
        comparison = a.index < b.index ? -1 : 1;
      }
      return order === "asc" ? comparison : -comparison;
    });
    return mappedData.map((el) => el.row);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setFilteredUsers(stableSort(filteredUsers, field, sortOrder));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFilterCoordenadoria = () => {
    const filtered = allUsers.filter(
      (user) =>
        (filterCoord === "" || user.IdCoordenadoria.toString() === filterCoord) &&
        (formData.IdUnidade === "" || user.IdUnidade.toString() === formData.IdUnidade) &&
        (formData.IdCargo === "" || user.IdCargo.toString() === formData.IdCargo) &&
        (filterStatusSelector === "" || user.Status.toString() === filterStatusSelector) &&
        (formData.Numero === "" || user.Numero.includes(formData.Numero))
    );

    setFilteredUsers(filtered);
    toast.info(`Filtro aplicado: Coordenadoria: ${filterCoord}, Status: ${filterStatusSelector}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData); // Adicione esta linha para verificar os valores dos campos

    if (
      !formData.Nome ||
      !formData.IdCoordenadoria ||
      !formData.IdUnidade ||
      !formData.IdCargo ||
      !formData.Numero ||
      !formData.Status
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    const statusValue = formData.Status === "true" ? 1 : 0;

    if (onEdit) {
      await axios
        .put("http://10.22.48.151:8801/" + onEdit.IdRamal, {
          Nome: formData.Nome,
          IdCoordenadoria: formData.IdCoordenadoria,
          IdUnidade: formData.IdUnidade,
          IdCargo: formData.IdCargo,
          Numero: formData.Numero,
          Status: statusValue,
        })
        .then(({ data }) => {
          toast.success(data);
          window.location.reload(); // Recarregar a página após salvar
        })
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://10.22.48.151:8801/", {
          Nome: formData.Nome,
          IdCoordenadoria: formData.IdCoordenadoria,
          IdUnidade: formData.IdUnidade,
          IdCargo: formData.IdCargo,
          Numero: formData.Numero,
          Status: statusValue,
        })
        .then(({ data }) => {
          toast.success(data);
          window.location.reload(); // Recarregar a página após salvar
        })
        .catch(({ data }) => toast.error(data));
    }

    setFormData({
      Nome: "",
      IdCoordenadoria: "",
      IdUnidade: "",
      IdCargo: "",
      Numero: "",
      Status: ""
    });

    setOnEdit(null);
    getUsers();
    setModalIsOpen(false);
  };

  const handleClear = (e) => {
    e.preventDefault();

    setFormData({
      Nome: "",
      IdCoordenadoria: "",
      IdUnidade: "",
      IdCargo: "",
      Numero: "",
      Status: ""
    });

    setFilterName("");
    setFilterCoord("");
    setFilterStatusSelector("");
    setFilteredUsers(allUsers); // Restaurar a lista original
    toast.info("Os campos foram limpos!");
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    setFormData({
      Nome: item.Nome,
      IdCoordenadoria: item.IdCoordenadoria.toString(),
      IdUnidade: item.IdUnidade.toString(),
      IdCargo: item.IdCargo.toString(),
      Numero: item.Numero,
      Status: item.Status === 1 ? "true" : "false"
    });
    setModalIsOpen(true); // Abrir modal ao clicar em editar
  };

  const handleDelete = async (IdRamal) => {
    if (window.confirm("Tem certeza que deseja excluir este ramal?")) {
      await axios
        .delete("http://10.22.48.151:8801/" + IdRamal)
        .then(({ data }) => {
          const newArray = filteredUsers.filter((user) => user.IdRamal !== IdRamal);

          setFilteredUsers(newArray);
          setAllUsers(newArray);
          toast.success(data);
        })
        .catch(({ data }) => toast.error(data));

      setOnEdit(null);
    }
  };

  const handleRowSelect = (item) => {
    setSelectedRow(item);
  };

  useEffect(() => {
    const generateColor = () => {
      const letters = "ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
      }
      return color;
    };

    const updatedColors = { ...coordenadoriaColors };

    filteredUsers.forEach((user) => {
      if (!updatedColors[user.NomeCoordenadoria]) {
        updatedColors[user.NomeCoordenadoria] = generateColor();
      }
    });

    setCoordenadoriaColors(updatedColors);
  }, [filteredUsers, coordenadoriaColors]);

  const generatePDF = (usersData, fileName) => {
    const doc = new jsPDF('landscape');
    const tableColumn = ["Nome", "Coordenadoria", "Unidade", "Cargo", "Ramal", "Status"];
    const tableRows = [];

    usersData.forEach(user => {
      const userData = [
        user.Nome,
        user.NomeCoordenadoria,
        user.NomeUnidade,
        user.NomeCargo,
        user.Numero,
        user.Status === 1 ? "Ativo" : "Desativado"
      ];
      tableRows.push(userData);
    });

    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Data: ${date}`, 14, 10);
    doc.text("Relatório de Usuários", 14, 15);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      margin: { top: 30 },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.text(`Data: ${date}`, 14, 10);
        doc.text("Relatório de Usuários", 14, 15);
      }
    });

    doc.save(`${fileName}.pdf`);
  };

  const handleFilterNameChange = (e) => {
    setFilterName(e.target.value);
    const filtered = allUsers.filter((user) =>
      user.Nome.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <>
      <Title>Ramais</Title>
      <FormContainer ref={ref} onSubmit={handleSubmit}>
        <InputArea>
          <Label>Nome</Label>
          <Input
            name="Nome"
            value={filterName}
            onChange={handleFilterNameChange}
          />
        </InputArea>
        <InputArea>
          <Label>Coordenadoria</Label>
          <StyledSelect
            name="filterCoord"
            value={filterCoord}
            onChange={(e) => setFilterCoord(e.target.value)}
          >
            <option value="">Todas</option>
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
          <Label>Unidade</Label>
          <StyledSelect
            name="IdUnidade"
            value={formData.IdUnidade}
            onChange={(e) => setFormData((prev) => ({ ...prev, IdUnidade: e.target.value }))}
          >
            <option value="">Todas</option>
            {unidades
              .slice()
              .sort((a, b) => a.Nome.localeCompare(b.Nome))
              .map((unidade) => (
                <option key={unidade.IdUnidade} value={unidade.IdUnidade}>
                  {unidade.Nome}
                </option>
              ))}
          </StyledSelect>
        </InputArea>
        <InputArea>
          <Label>Cargo</Label>
          <StyledSelect
            name="IdCargo"
            value={formData.IdCargo}
            onChange={(e) => setFormData((prev) => ({ ...prev, IdCargo: e.target.value }))}
          >
            <option value="">Todas</option>
            {cargos
              .slice()
              .sort((a, b) => a.Nome.localeCompare(b.Nome))
              .map((cargo) => (
                <option key={cargo.IdCargo} value={cargo.IdCargo}>
                  {cargo.Nome}
                </option>
              ))}
          </StyledSelect>
        </InputArea>
        <InputArea>
          <Label>Ramal</Label>
          <Input
            name="Numero"
            value={formData.Numero}
            onChange={handleInputChange}
          />
        </InputArea>
        <InputArea>
          <Label>Status</Label>
          <StyledSelect
            name="filterStatusSelector"
            value={filterStatusSelector}
            onChange={(e) => setFilterStatusSelector(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Ativo</option>
            <option value="0">Desativado</option>
          </StyledSelect>
        </InputArea>
        <Button id="filter" type="button" onClick={handleFilterCoordenadoria}>Filtrar</Button>
        <Button id="edit" type="button" onClick={() => handleEdit(selectedRow)}>Editar</Button>
        <Button id="clear" type="button" onClick={handleClear}>Limpar</Button>
        <Button type="submit">Salvar</Button>
        <Button id="pdf" type="button" onClick={() => generatePDF(filteredUsers, 'lista_ramais')}>
          <FaFilePdf /> 
        </Button>
      </FormContainer>
      <Table>
        <Thead>
          <Tr>
            <Th></Th>
            <Th onClick={() => handleSort("Nome")}>
              {sortField === "Nome" ? (
                sortOrder === "asc" ? (
                  <>Nome ▼</>
                ) : (
                  <>Nome ▲</>
                )
              ) : (
                "Nome"
              )}
            </Th>
            <Th onClick={() => handleSort("Coordenadoria")}>
              {sortField === "Coordenadoria" ? (
                sortOrder === "asc" ? (
                  <>Coordenadoria ▼</>
                ) : (
                  <>Coordenadoria ▲</>
                )
              ) : (
                "Coordenadoria"
              )}
            </Th>
            <Th onClick={() => handleSort("Unidade")}>
              {sortField === "Unidade" ? (
                sortOrder === "asc" ? (
                  <>Unidade ▲</>
                ) : (
                  <>Unidade ▼</>
                )
              ) : (
                "Unidade"
              )}
            </Th>
            <Th onClick={() => handleSort("Cargo")}>
              {sortField === "Cargo" ? (
                sortOrder === "asc" ? (
                  <>Cargo ▲</>
                ) : (
                  <>Cargo ▼</>
                )
              ) : (
                "Cargo"
              )}
            </Th>
            <Th>Ramal</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((item, index) => (
            <Tr
              key={index}
              style={{ 
                background: coordenadoriaColors[item.NomeCoordenadoria],
              }}
              onClick={() => handleRowSelect(item)}
            >
              <TdIcon alignCenter width="5%">
                {selectedRow && selectedRow.IdRamal === item.IdRamal ? (
                  <FaCheckSquare />
                ) : (
                  <FaSquare />
                )}
              </TdIcon>
              <Td width="25%">{item.Nome}</Td>
              <Td width="20%">{item.NomeCoordenadoria}</Td>
              <Td width="15%">{item.NomeUnidade}</Td>
              <Td width="15%">{item.NomeCargo}</Td>
              <Td width="10%">{item.Numero}</Td>
              <Td width="5%">
                {item.Status === 1 ? "Ativo" : "Desativado"}
              </Td>
              <Td width="5%">
                <FaEdit onClick={() => handleEdit(item)} />
                <FaTrash onClick={() => handleDelete(item.IdRamal)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit User"
        style={{
          overlay: {
            backgroundColor: 'rgba(5, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '30px',
            borderRadius: '10px',
            width: '80%',
            maxHeight: '90%',
            overflow: 'auto',
          },
        }}
      >
        <h2>Editar Usuário</h2>
        <FormContainer onSubmit={handleSubmit}>
          <InputArea>
            <Label>Nome</Label>
            <Input
              name="Nome"
              value={formData.Nome}
              onChange={handleInputChange}
              large
            />
          </InputArea>
          <InputArea>
            <Label>Coordenadoria</Label>
            <StyledSelect
              name="IdCoordenadoria"
              value={formData.IdCoordenadoria}
              onChange={(e) => setFormData((prev) => ({ ...prev, IdCoordenadoria: e.target.value }))}
            >
              <option value="">Todas</option>
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
            <Label>Unidade</Label>
            <StyledSelect
              name="IdUnidade"
              value={formData.IdUnidade}
              onChange={(e) => setFormData((prev) => ({ ...prev, IdUnidade: e.target.value }))}
            >
              <option value="">Todas</option>
              {unidades
                .slice()
                .sort((a, b) => a.Nome.localeCompare(b.Nome))
                .map((unidade) => (
                  <option key={unidade.IdUnidade} value={unidade.IdUnidade}>
                    {unidade.Nome}
                  </option>
                ))}
            </StyledSelect>
          </InputArea>
          <InputArea>
            <Label>Cargo</Label>
            <StyledSelect
              name="IdCargo"
              value={formData.IdCargo}
              onChange={(e) => setFormData((prev) => ({ ...prev, IdCargo: e.target.value }))}
            >
              <option value="">Todas</option>
              {cargos
                .slice()
                .sort((a, b) => a.Nome.localeCompare(b.Nome))
                .map((cargo) => (
                  <option key={cargo.IdCargo} value={cargo.IdCargo}>
                    {cargo.Nome}
                  </option>
                ))}
            </StyledSelect>
          </InputArea>
          <InputArea>
            <Label>Ramal</Label>
            <Input
              name="Numero"
              value={formData.Numero}
              onChange={handleInputChange}
            />
          </InputArea>
          <InputArea>
            <Label>Status</Label>
            <StyledSelect
              name="Status"
              value={formData.Status}
              onChange={(e) => setFormData((prev) => ({ ...prev, Status: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="true">Ativo</option>
              <option value="false">Desativado</option>
            </StyledSelect>
          </InputArea>
          <Button type="submit">Alterar</Button>
        </FormContainer>
      </Modal>
    </>
  );
};


export default FormGrid;
