import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { campaignValidationSchema } from 'validationSchema/campaigns';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.campaign
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCampaignById();
    case 'PUT':
      return updateCampaignById();
    case 'DELETE':
      return deleteCampaignById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCampaignById() {
    const data = await prisma.campaign.findFirst(convertQueryToPrismaUtil(req.query, 'campaign'));
    return res.status(200).json(data);
  }

  async function updateCampaignById() {
    await campaignValidationSchema.validate(req.body);
    const data = await prisma.campaign.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteCampaignById() {
    const data = await prisma.campaign.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
