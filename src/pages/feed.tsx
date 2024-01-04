import Head from 'next/head';
import { Box, Container, Heading, VStack } from '@chakra-ui/react';
import { type GetServerSideProps } from 'next';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';

export const getServerSideProps = (async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) return { redirect: { destination: '/', permanent: false } };
  return { props: {} };
}) satisfies GetServerSideProps;

export default function Feed() {
  const { data } = api.feed.fetch.useQuery({});
  return (
    <>
      <Head>
        <title>Kraai - Feed</title>
        <meta
          name="description"
          content="Kraai - A place to find your favorite content, and only your favorite content"
        />
      </Head>
      <VStack as="main" gap={4}>
        <Box py="6">
          <Heading as="h2" size="xl">
            Your Feed
          </Heading>
        </Box>
        {data?.items.map((item, i) => (
          <Container bg="gray.700" p="10" rounded="md" key={`article-${i}`}>
            <Heading as="h2" size="lg">
              <a href={item.url} target="_blank">
                {item.title}
              </a>
            </Heading>
            <Box dangerouslySetInnerHTML={{ __html: item.content }} />
          </Container>
        ))}
      </VStack>
    </>
  );
}
