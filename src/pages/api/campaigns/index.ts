import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { campaignValidationSchema } from 'validationSchema/campaigns';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCampaigns();
    case 'POST':
      return createCampaign();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCampaigns() {
    const data = await prisma.campaign
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'campaign'));
    return res.status(200).json(data);
  }

  async function createCampaign() {
    await campaignValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.campaign_performance?.length > 0) {
      const create_campaign_performance = body.campaign_performance;
      body.campaign_performance = {
        create: create_campaign_performance,
      };
    } else {
      delete body.campaign_performance;
    }
    const data = await prisma.campaign.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
