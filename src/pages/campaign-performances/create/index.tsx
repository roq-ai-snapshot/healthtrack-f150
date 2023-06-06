import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createCampaignPerformance } from 'apiSdk/campaign-performances';
import { Error } from 'components/error';
import { campaignPerformanceValidationSchema } from 'validationSchema/campaign-performances';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CampaignInterface } from 'interfaces/campaign';
import { getCampaigns } from 'apiSdk/campaigns';
import { CampaignPerformanceInterface } from 'interfaces/campaign-performance';

function CampaignPerformanceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CampaignPerformanceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCampaignPerformance(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CampaignPerformanceInterface>({
    initialValues: {
      metric: '',
      value: 0,
      date: new Date(new Date().toDateString()),
      campaign_id: (router.query.campaign_id as string) ?? null,
    },
    validationSchema: campaignPerformanceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Campaign Performance
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="metric" mb="4" isInvalid={!!formik.errors?.metric}>
            <FormLabel>Metric</FormLabel>
            <Input type="text" name="metric" value={formik.values?.metric} onChange={formik.handleChange} />
            {formik.errors.metric && <FormErrorMessage>{formik.errors?.metric}</FormErrorMessage>}
          </FormControl>
          <FormControl id="value" mb="4" isInvalid={!!formik.errors?.value}>
            <FormLabel>Value</FormLabel>
            <NumberInput
              name="value"
              value={formik.values?.value}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('value', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.value && <FormErrorMessage>{formik.errors?.value}</FormErrorMessage>}
          </FormControl>
          <FormControl id="date" mb="4">
            <FormLabel>Date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.date}
              onChange={(value: Date) => formik.setFieldValue('date', value)}
            />
          </FormControl>
          <AsyncSelect<CampaignInterface>
            formik={formik}
            name={'campaign_id'}
            label={'Select Campaign'}
            placeholder={'Select Campaign'}
            fetcher={getCampaigns}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'campaign_performance',
  operation: AccessOperationEnum.CREATE,
})(CampaignPerformanceCreatePage);
