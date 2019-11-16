import styled from 'vue-styled-components';

const Message = styled('div', {
  success: Boolean,
  error: Boolean,
  info: Boolean,
})`
  color: white;
  background-color: ${props => 
    props.success
      ? 'var(--success-color)'
      : props.warning
        ? 'var(--warning-color)'
        : props.error
          ? 'var(--error-color)'
          : 'var(--default-font-color)'};
  padding: 8px;
  border-radius: 4px;
  margin: 8px 0;
`;

export default Message;
