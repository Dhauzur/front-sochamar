import styled from 'vue-styled-components';

const FormHelper = styled('div', {
	error: Boolean,
})`
	padding: 0 0 8px;
	color: ${props => (props.error ? 'var(--error-color)' : 'var(--default-font-color)')};
	font-size: 12px;
	margin-top: -8px;
`;

export default FormHelper;
