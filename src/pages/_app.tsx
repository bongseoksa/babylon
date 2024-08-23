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
    let path = router.pathname;

    // 브랜치별로 디폴트 주소 변경
    if (path === '/') path = ROUTE_PATH['VILLAGE_ANIMATION'];
    router.push(path);
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
