import styled from 'vue-styled-components';

const Input = styled.input`
	border: 1px solid var(--light-grey-color);
	border-radius: 4px;
	margin-bottom: 16px;
	height: 40px;
	padding: 8px;
	font-size: 14px;
	color: var(--medium-grey-color);
	outline: none;

	&:focus {
		border: 1px solid var(--primary-color);
	}
`;

export default Input;
