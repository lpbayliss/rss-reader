import { Box } from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';

type HelloProps = { name: string };

const Hello = ({ name }: HelloProps) => (
  <Box>
    <FormattedMessage defaultMessage="Hello World and {name}!" id="Y1MJI3" values={{ name }} />
  </Box>
);

export default Hello;
