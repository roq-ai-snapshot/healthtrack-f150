import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getClientById } from 'apiSdk/clients';
import { Error } from 'components/error';
import { ClientInterface } from 'interfaces/client';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteFitnessDataById } from 'apiSdk/fitness-data';
import { deleteGoalById } from 'apiSdk/goals';

function ClientViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ClientInterface>(
    () => (id ? `/clients/${id}` : null),
    () =>
      getClientById(id, {
        relations: ['user_client_user_idTouser', 'user_client_health_coach_idTouser', 'fitness_data', 'goal'],
      }),
  );

  const fitness_dataHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteFitnessDataById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const goalHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteGoalById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Client Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User Client User Id Touser:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user_client_user_idTouser?.id}`}>
                    {data?.user_client_user_idTouser?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User Client Health Coach Id Touser:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user_client_health_coach_idTouser?.id}`}>
                    {data?.user_client_health_coach_idTouser?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('fitness_data', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Fitness Data:
                </Text>
                <NextLink passHref href={`/fitness-data/create?client_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>data_type</Th>
                        <Th>value</Th>
                        <Th>date</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.fitness_data?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.data_type}</Td>
                          <Td>{record.value}</Td>
                          <Td>{record.date as unknown as string}</Td>
                          <Td>
                            <NextLink passHref href={`/fitness-data/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/fitness-data/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => fitness_dataHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Goals:
                </Text>
                <NextLink passHref href={`/goals/create?client_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>description</Th>
                        <Th>target_date</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.goal?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.description}</Td>
                          <Td>{record.target_date as unknown as string}</Td>
                          <Td>
                            <NextLink passHref href={`/goals/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/goals/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => goalHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
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
  entity: 'client',
  operation: AccessOperationEnum.READ,
})(ClientViewPage);
