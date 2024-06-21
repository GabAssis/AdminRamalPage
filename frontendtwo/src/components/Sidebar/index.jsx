import React from 'react'
import { Container, Content } from './styles'
import SidebarItem from '../SidebarItem'
import { 
  FaTimes, 
  FaHome, 
  FaEnvelope, 
  FaPhoneAlt,
  FaUserAlt, 
  FaAddressBook,
  FaArrowAltCircleLeft
} from 'react-icons/fa'


const baseURL=process.env.REACT_APP_API_URL



const Sidebar = ({ active }) => {

  const closeSidebar = () => {
    active(false)
  }

  return (
    <Container sidebar={active}>
      <FaTimes onClick={closeSidebar} />  
      <Content>
      <a href={`${baseURL}menu`}>
        <SidebarItem Icon={FaHome} Text="Home" />
      </a>
      <a href={`${baseURL}ramalcrud`}>
        <SidebarItem Icon={FaPhoneAlt} Text="Ramal" />
      </a>
      <a href={`${baseURL}coordenadoriacrud`}>
        <SidebarItem Icon={FaAddressBook} Text="Coordenadoria" />
      </a>
      <a href={`${baseURL}unidadecrud`}>
        <SidebarItem Icon={FaUserAlt} Text="Unidade" />
      </a>
      <a href={`${baseURL}cargocrud`}>
        <SidebarItem Icon={FaEnvelope} Text="Cargo" />
      </a>
      <a href={`${baseURL}`}>
        <SidebarItem Icon={FaArrowAltCircleLeft} Text="Sair" />
      </a>
      </Content>
    </Container>
  )
}

export default Sidebar