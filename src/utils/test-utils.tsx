import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { getMessages } from '~/i18n';
import theme from '~/theme';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <IntlProvider locale={'en-AU'} messages={getMessages(String('en-AU'))}>
      <SessionProvider session={{ expires: '', user: { id: 'user' } }}>
        <ChakraProvider resetCSS theme={theme}>
          {children}
        </ChakraProvider>
      </SessionProvider>
    </IntlProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
