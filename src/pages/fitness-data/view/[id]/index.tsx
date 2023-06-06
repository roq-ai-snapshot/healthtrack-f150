import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getFitnessDataById } from 'apiSdk/fitness-data';
import { Error } from 'components/error';
import { FitnessDataInterface } from 'interfaces/fitness-data';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function FitnessDataViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FitnessDataInterface>(
    () => (id ? `/fitness-data/${id}` : null),
    () =>
      getFitnessDataById(id, {
        relations: ['client'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Fitness Data Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Data Type:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.data_type}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Value:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.value}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Date:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.date as unknown as string}
            </Text>
            <br />
            {hasAccess('client', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Client:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/clients/view/${data?.client?.id}`}>
                    {data?.client?.user_id}
                  </Link>
                </Text>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'fitness_data',
  operation: AccessOperationEnum.READ,
})(FitnessDataViewPage);
