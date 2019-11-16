import styled from 'vue-styled-components';

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  height: 48px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  outline: none;

  &:hover {
    background-color: var(--primary-lighter);
  }
`;

export default Button;
