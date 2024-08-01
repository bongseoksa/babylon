import { theme } from '@/styles/theme';
import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

const GlobalStyle = createGlobalStyle`
${reset}
`;

export default GlobalStyle;
