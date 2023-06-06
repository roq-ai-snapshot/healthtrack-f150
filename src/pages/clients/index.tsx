import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getClients, deleteClientById } from 'apiSdk/clients';
import { ClientInterface } from 'interfaces/client';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ClientListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ClientInterface[]>(
    () => '/clients',
    () =>
      getClients({
        relations: [
          'user_client_user_idTouser',
          'user_client_health_coach_idTouser',
          'fitness_data.count',
          'goal.count',
        ],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteClientById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Client
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('client', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/clients/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_client_user_idTouser</Th>
                  )}
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_client_health_coach_idTouser</Th>
                  )}
                  {hasAccess('fitness_data', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>fitness_data</Th>
                  )}
                  {hasAccess('goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>goal</Th>}
                  {hasAccess('client', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('client', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('client', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    {hasAccess('user_client_user_idTouser', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user_client_user_idTouser?.id}`}>
                          {record.user_client_user_idTouser?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess(
                      'user_client_health_coach_idTouser',
                      AccessOperationEnum.READ,
                      AccessServiceEnum.PROJECT,
                    ) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user_client_health_coach_idTouser?.id}`}>
                          {record.user_client_health_coach_idTouser?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('fitness_data', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.fitness_data}</Td>
                    )}
                    {hasAccess('goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.goal}</Td>
                    )}
                    {hasAccess('client', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/clients/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('client', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/clients/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('client', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'client',
  operation: AccessOperationEnum.READ,
})(ClientListPage);
