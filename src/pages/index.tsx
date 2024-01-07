import Head from 'next/head';
import { Box, Button, Container, HStack, Heading, Text } from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

export default function Index() {
  const { push } = useRouter();
  const { status } = useSession();

  const handleGetStartedOnClick = async () => {
    if (status === 'unauthenticated') await signIn();
    else await push('/feed');
  };

  return (
    <>
      <Head>
        <title>Kraai</title>
        <meta
          name="description"
          content="Kraai - A place to find your favorite content, and only your favorite content"
        />
      </Head>
      <Container as="main">
        <Box pt="12">
          <HStack pb="4" justifyContent="center">
            <Text fontSize="xxx-large">🐦‍⬛</Text>
            <Heading as="h1" fontSize="xxx-large">
              <FormattedMessage defaultMessage="Kraai" description="Name of application" id="UXgc5w" />
            </Heading>
          </HStack>
          <Text textAlign="center" fontStyle="italic">
            <FormattedMessage
              defaultMessage="A place to find your favorite content, and only your favorite content"
              description="Product tagline"
              id="ZzjeqO"
            />
          </Text>
          <HStack justifyContent="center" py="8">
            <Button onClick={handleGetStartedOnClick}>
              <FormattedMessage defaultMessage="Get started" id="/aBLH2" />
            </Button>
          </HStack>
        </Box>
      </Container>
    </>
  );
}
