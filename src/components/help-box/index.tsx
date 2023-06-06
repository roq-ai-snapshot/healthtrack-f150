import React from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useSession } from '@roq/nextjs';

export const HelpBox: React.FC = () => {
  const ownerRoles = ['Founder'];
  const roles = ['Founder', 'Health Coach', 'Product', 'Marketing', 'Guest'];
  const applicationName = 'HealthTrack';
  const tenantName = 'Fitness Tracker';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const userStories = `Founder:
1. As a founder, I want to be able to view and analyze the overall usage statistics of the HealthTrack app, so that I can make informed decisions about the direction and growth of the company.
2. As a founder, I want to be able to access and manage the financial data of the company, so that I can ensure the financial health and sustainability of the business.
3. As a founder, I want to be able to communicate with my team members (Health Coaches, Product, and Marketing) through the app, so that we can collaborate effectively and efficiently.
4. As a founder, I want to be able to monitor the satisfaction and feedback of our users, so that we can continuously improve our product and services.

Health Coach:
1. As a health coach, I want to be able to view and analyze the fitness data of my clients, so that I can provide personalized guidance and support to help them achieve their wellness goals.
2. As a health coach, I want to be able to set personalized targets for my clients, so that they have clear and achievable goals to work towards.
3. As a health coach, I want to be able to communicate with my clients through the app, so that I can provide ongoing support and motivation.
4. As a health coach, I want to be able to track my clients' progress over time, so that I can celebrate their successes and help them overcome any challenges.

Product:
1. As a product team member, I want to be able to analyze user feedback and usage data, so that I can identify areas for improvement and prioritize new features.
2. As a product team member, I want to be able to collaborate with my team members (Founder, Health Coaches, and Marketing) through the app, so that we can work together to create the best possible product.
3. As a product team member, I want to be able to track the progress of new features and updates, so that I can ensure timely and efficient delivery.

Marketing:
1. As a marketing team member, I want to be able to analyze user data and demographics, so that I can create targeted marketing campaigns to attract new users.
2. As a marketing team member, I want to be able to track the success of our marketing campaigns, so that I can optimize our strategies and maximize our return on investment.
3. As a marketing team member, I want to be able to collaborate with my team members (Founder, Health Coaches, and Product) through the app, so that we can work together to promote the HealthTrack app and grow our user base.

Guest:
1. As a guest, I want to be able to explore the features and benefits of the HealthTrack app, so that I can decide if it's the right fit for my wellness goals.
2. As a guest, I want to be able to view testimonials and success stories from current users, so that I can see the potential impact of the app on my own health and well-being.
3. As a guest, I want to be able to easily sign up for the HealthTrack app, so that I can start tracking my fitness data and working towards my wellness goals.`;

  const { session } = useSession();
  if (!process.env.NEXT_PUBLIC_SHOW_BRIEFING || process.env.NEXT_PUBLIC_SHOW_BRIEFING === 'false') {
    return null;
  }
  return (
    <Box width={1} position="fixed" left="20px" bottom="20px" zIndex={3}>
      <Popover placement="top">
        <PopoverTrigger>
          <IconButton
            aria-label="Help Info"
            icon={<FiInfo />}
            bg="blue.800"
            color="white"
            _hover={{ bg: 'blue.800' }}
            _active={{ bg: 'blue.800' }}
            _focus={{ bg: 'blue.800' }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>App Briefing</PopoverHeader>
          <PopoverBody maxH="400px" overflowY="auto">
            <Text mb="2">Hi there!</Text>
            <Text mb="2">
              Welcome to {applicationName}, your freshly generated B2B SaaS application. This in-app briefing will guide
              you through your application. Feel free to remove this tutorial with the{' '}
              <Box as="span" bg="yellow.300" p={1}>
                NEXT_PUBLIC_SHOW_BRIEFING
              </Box>{' '}
              environment variable.
            </Text>
            <Text mb="2">You can use {applicationName} with one of these roles:</Text>
            <UnorderedList mb="2">
              {roles.map((role) => (
                <ListItem key={role}>{role}</ListItem>
              ))}
            </UnorderedList>
            {session?.roqUserId ? (
              <Text mb="2">You are currently logged in as a {session?.user?.roles?.join(', ')}.</Text>
            ) : (
              <Text mb="2">
                Right now, you are not logged in. The best way to start your journey is by signing up as{' '}
                {ownerRoles.join(', ')} and to create your first {tenantName}.
              </Text>
            )}
            <Text mb="2">
              {applicationName} was generated based on these user stories. Feel free to try them out yourself!
            </Text>
            <Box mb="2" whiteSpace="pre-wrap">
              {userStories}
            </Box>
            <Text mb="2">
              If you are happy with the results, then you can get the entire source code here:{' '}
              <Link href={githubUrl} color="cyan.500" isExternal>
                {githubUrl}
              </Link>
            </Text>
            <Text mb="2">
              Console Dashboard: For configuration and customization options, access our console dashboard. Your project
              has already been created and is waiting for your input. Check your emails for the invite.
            </Text>
            <Text mb="2">
              <Link href="https://console.roq.tech" color="cyan.500" isExternal>
                ROQ Console
              </Link>
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
