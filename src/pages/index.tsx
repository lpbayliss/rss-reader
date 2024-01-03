import Head from 'next/head';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';

export default function Home() {
  return (
    <>
      <Head>
        <title>Starter App</title>
        <meta name="description" content="A Project Starter App" />
      </Head>
      <Container as="main">
        <Box>
          <Heading>
            <FormattedMessage defaultMessage="Starter App Project" description="Name of project" id="+rSl7d" />
          </Heading>
          <Text>
            <FormattedMessage defaultMessage="Hello world" description="Hello message" id="RsbSsm" />
          </Text>
        </Box>
      </Container>
    </>
  );
}
