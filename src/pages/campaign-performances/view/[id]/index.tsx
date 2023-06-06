import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getCampaignPerformanceById } from 'apiSdk/campaign-performances';
import { Error } from 'components/error';
import { CampaignPerformanceInterface } from 'interfaces/campaign-performance';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function CampaignPerformanceViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CampaignPerformanceInterface>(
    () => (id ? `/campaign-performances/${id}` : null),
    () =>
      getCampaignPerformanceById(id, {
        relations: ['campaign'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Campaign Performance Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Metric:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.metric}
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
            {hasAccess('campaign', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Campaign:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/campaigns/view/${data?.campaign?.id}`}>
                    {data?.campaign?.name}
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
  entity: 'campaign_performance',
  operation: AccessOperationEnum.READ,
})(CampaignPerformanceViewPage);
