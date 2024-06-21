import styled from 'styled-components';

export const Container = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  background-color: #1A202C; 
  box-shadow: 0 0 20px 3px rgba(0, 0, 0, 0.2);
  position: relative; // Ensure relative positioning for child elements
`;

export const MenuIcon = styled.div`
  position: absolute;
  color: white;
  width: 50px;
  height: 50px;
  top: 35px; // Adjust as needed for vertical alignment
  left: 32px; // Adjust as needed for horizontal alignment
  cursor: pointer;
  z-index: 1000; // Ensure the icon stays on top of other elements
`;

export const HeaderText = styled.p`
  margin: 0;
  color: white;
  font-size: 20px;
  text-align: center;
  width: 100%; // Ensure it takes the full width to center properly
  position: absolute; // Position it absolutely within the Container
  left: 50%; // Center it horizontally
  transform: translateX(-50%); // Correct the centering offset
`;
