import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { IntlProvider } from 'react-intl';
import { type AppType } from 'next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/router';

import { api } from '~/utils/api';
import theme from '~/theme';
import { getMessages } from '~/i18n';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const { locale } = useRouter();

  return (
    <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
      <SessionProvider session={session}>
        <ChakraProvider resetCSS theme={theme}>
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </IntlProvider>
  );
};

export default api.withTRPC(MyApp);
