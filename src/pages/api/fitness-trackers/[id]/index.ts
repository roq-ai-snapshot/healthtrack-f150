import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { fitnessTrackerValidationSchema } from 'validationSchema/fitness-trackers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.fitness_tracker
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFitnessTrackerById();
    case 'PUT':
      return updateFitnessTrackerById();
    case 'DELETE':
      return deleteFitnessTrackerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFitnessTrackerById() {
    const data = await prisma.fitness_tracker.findFirst(convertQueryToPrismaUtil(req.query, 'fitness_tracker'));
    return res.status(200).json(data);
  }

  async function updateFitnessTrackerById() {
    await fitnessTrackerValidationSchema.validate(req.body);
    const data = await prisma.fitness_tracker.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteFitnessTrackerById() {
    const data = await prisma.fitness_tracker.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
