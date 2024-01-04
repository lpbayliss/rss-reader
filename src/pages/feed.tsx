import Head from 'next/head';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { type GetServerSideProps } from 'next';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { FormattedMessage } from 'react-intl';

type CreateSourceFormInputs = {
  url: string;
};
const CreateSourceForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateSourceFormInputs>();

  const addSourceMutation = api.feed.createSource.useMutation({
    onSuccess() {
      reset();
    },
  });

  const handleOnSubmit: SubmitHandler<CreateSourceFormInputs> = async ({ url }) => {
    await addSourceMutation.mutateAsync({ url });
  };

  return (
    <HStack as="form" onSubmit={handleSubmit(handleOnSubmit)} alignItems="start">
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
  const { data } = api.feed.fetch.useQuery({});
  const processSourcesMutation = api.feed.processSources.useMutation();

  const onProcessSources = async () => {
    await processSourcesMutation.mutateAsync({});
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
      <VStack as="main" gap={4}>
        <Box py="6">
          <Heading as="h2" size="xl">
            Your Feed
          </Heading>
        </Box>
        <Box>
          <CreateSourceForm />
          <Button onClick={onProcessSources}>
            <FormattedMessage defaultMessage="Process" id="QZp8LQ" />
          </Button>
        </Box>
        {data?.map((item, i) => (
          <Container bg="gray.700" p="10" rounded="md" key={item.id}>
            <Heading as="h2" size="lg">
              <a href={item.url} target="_blank">
                {item.title}
              </a>
            </Heading>
            {/* <Box dangerouslySetInnerHTML={{ __html: item.content }} /> */}
          </Container>
        ))}
      </VStack>
    </>
  );
}
