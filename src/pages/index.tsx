import Head from 'next/head';
import { Box, Button, Container, HStack, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';

type Props = {
  providers: Awaited<ReturnType<typeof getProviders>>;
};

export const getServerSideProps = (async (_ctx) => {
  const providers = await getProviders();
  return { props: { providers } };
}) satisfies GetServerSideProps<Props>;

export default function Index({ providers }: Props) {
  const { push } = useRouter();
  const { data: session } = useSession();

  const handleGetStartedOnClick = async () => {
    if (!session) void signIn();
    await push('/feed');
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
          <VStack>
            {providers &&
              Object.values(providers).map((provider) => (
                <Link key={provider.id} href={provider.signinUrl}>
                  {provider.name}
                </Link>
              ))}
          </VStack>
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
