import GlobalStyle from '@/styles/globalStyle';
import { theme } from '@/styles/theme';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { ThemeProvider } from 'styled-components';
import { ROUTE_PATH } from '@/router/routeData';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTE_PATH['HOME']);
  }, []);

  return (
    <>
      <RecoilRoot>
        <RecoilNexus />
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </RecoilRoot>
    </>
  );
}
