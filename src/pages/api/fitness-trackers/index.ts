import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { fitnessTrackerValidationSchema } from 'validationSchema/fitness-trackers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getFitnessTrackers();
    case 'POST':
      return createFitnessTracker();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFitnessTrackers() {
    const data = await prisma.fitness_tracker
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'fitness_tracker'));
    return res.status(200).json(data);
  }

  async function createFitnessTracker() {
    await fitnessTrackerValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.fitness_tracker.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
