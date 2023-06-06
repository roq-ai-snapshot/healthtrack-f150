import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { campaignPerformanceValidationSchema } from 'validationSchema/campaign-performances';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.campaign_performance
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCampaignPerformanceById();
    case 'PUT':
      return updateCampaignPerformanceById();
    case 'DELETE':
      return deleteCampaignPerformanceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCampaignPerformanceById() {
    const data = await prisma.campaign_performance.findFirst(
      convertQueryToPrismaUtil(req.query, 'campaign_performance'),
    );
    return res.status(200).json(data);
  }

  async function updateCampaignPerformanceById() {
    await campaignPerformanceValidationSchema.validate(req.body);
    const data = await prisma.campaign_performance.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteCampaignPerformanceById() {
    const data = await prisma.campaign_performance.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
