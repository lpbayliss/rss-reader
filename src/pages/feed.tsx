import Head from 'next/head';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { type GetServerSideProps } from 'next';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { FormattedMessage } from 'react-intl';
import { formatRelative } from 'date-fns';
import { signOut } from 'next-auth/react';

const MySources = () => {
  const { data } = api.feed.fetchMySources.useQuery({});
  return (
    <VStack alignItems="start" w="full">
      {data?.map((item) => (
        <HStack key={item.id} w="full">
          <Text size="lg">{item.title}</Text>
          <Button colorScheme="red" ml="auto" size="sm">
            Remove
          </Button>
        </HStack>
      ))}
    </VStack>
  );
};

type CreateSourceFormInputs = {
  url: string;
};
const CreateSourceForm = () => {
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateSourceFormInputs>();

  const addSourceMutation = api.feed.createSource.useMutation({
    async onSuccess() {
      reset();
      await utils.feed.fetchMySources.invalidate();
    },
  });

  const handleOnSubmit: SubmitHandler<CreateSourceFormInputs> = async ({ url }) => {
    await addSourceMutation.mutateAsync({ url });
  };

  return (
    <HStack
      as="form"
      onSubmit={handleSubmit(handleOnSubmit)}
      alignItems="start"
      pt="4"
      pb="2"
      alignSelf="start"
      w="full"
    >
      <FormControl isInvalid={!!errors.url}>
        <Input
          id="source-url"
          placeholder="https://news.ycombinator.com/rss"
          {...register('url', { required: 'Must provide a url' })}
        />
        <FormHelperText>
          <FormattedMessage defaultMessage="Provide the url of an RSS feed" id="2CAito" />
        </FormHelperText>
        <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
      </FormControl>
      <Button isLoading={isSubmitting} type="submit" px="6">
        <FormattedMessage defaultMessage="Add source" id="yQ3Gm4" />
      </Button>
    </HStack>
  );
};

export const getServerSideProps = (async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) return { redirect: { destination: '/', permanent: false } };
  return { props: {} };
}) satisfies GetServerSideProps;

export default function Feed() {
  if (typeof window === 'undefined') return null;

  const utils = api.useUtils();
  const { data } = api.feed.fetch.useQuery({});
  const { mutateAsync, isLoading } = api.feed.processSources.useMutation({
    async onSuccess() {
      await utils.feed.fetch.invalidate();
    },
  });

  const { mutateAsync: readArticleMutateAsync } = api.feed.readArticle.useMutation({
    async onSuccess() {
      await utils.feed.fetch.invalidate();
    },
  });

  const onProcessSources = async () => {
    await mutateAsync({});
  };

  const handleReadArticle = (id: string) => async () => {
    await readArticleMutateAsync({ id });
    await utils.feed.fetch.invalidate();
  };

  return (
    <>
      <Head>
        <title>Kraai - Feed</title>
        <meta
          name="description"
          content="Kraai - A place to find your favorite content, and only your favorite content"
        />
      </Head>
      <Stack direction={['column', null, 'row']} as="main" gap={4} alignItems="start" p="4" w="full">
        <VStack as="section" minW="xs" maxW={[null, null, 'sm']} w="full">
          <Heading as="h2" size="xl" alignSelf="start">
            Your Feed
          </Heading>
          <Divider />
          <CreateSourceForm />
          <MySources />
          <Button colorScheme="green" onClick={onProcessSources} isLoading={isLoading} w="full" mt="4">
            <FormattedMessage defaultMessage="Process" id="QZp8LQ" />
          </Button>
          <Button colorScheme="red" onClick={() => signOut()} w="full" mt="4">
            <FormattedMessage defaultMessage="Sign out" id="xXbJso" />
          </Button>
        </VStack>
        <VStack flexGrow="2">
          {data?.map((item) => (
            <Box
              bg={item.usersToArticles[0]?.lastRead ? 'gray.500' : 'gray.700'}
              p="4"
              rounded="md"
              key={item.id}
              w="full"
            >
              <Text fontSize="large">
                <Link
                  href={item.url}
                  onClick={handleReadArticle(item.id)}
                  onAuxClick={handleReadArticle(item.id)}
                  target="_blank"
                >
                  {item.title}
                </Link>{' '}
                ({item.source.title})
              </Text>
              <Text fontStyle="italic" fontSize="small">
                {formatRelative(item.timestamp, new Date())}
              </Text>
              {/* <Box dangerouslySetInnerHTML={{ __html: item.content }} /> */}
            </Box>
          ))}
        </VStack>
      </Stack>
    </>
  );
}
