import React, { useState } from 'react';
import { Container, MenuIcon, HeaderText } from './styles';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../Sidebar';

const Header = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <Container>
      <MenuIcon onClick={showSidebar}>
        <FaBars />
      </MenuIcon>
      {sidebar && <Sidebar active={setSidebar} />}
      <HeaderText>SUBPREFEITURA JABAQUARA/NTI</HeaderText>
    </Container>
  );
};

export default Header;
