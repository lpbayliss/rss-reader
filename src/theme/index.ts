import { extendTheme, type Theme, type ThemeOverride } from '@chakra-ui/react';
import { Karla } from 'next/font/google';

const karla = Karla({ subsets: ['latin'] });

const overrides: ThemeOverride = {
  fonts: {
    heading: karla.style.fontFamily,
    body: karla.style.fontFamily,
  },
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
};

export default extendTheme(overrides) as Theme;
