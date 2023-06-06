import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { fitnessDataValidationSchema } from 'validationSchema/fitness-data';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.fitness_data
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFitnessDataById();
    case 'PUT':
      return updateFitnessDataById();
    case 'DELETE':
      return deleteFitnessDataById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFitnessDataById() {
    const data = await prisma.fitness_data.findFirst(convertQueryToPrismaUtil(req.query, 'fitness_data'));
    return res.status(200).json(data);
  }

  async function updateFitnessDataById() {
    await fitnessDataValidationSchema.validate(req.body);
    const data = await prisma.fitness_data.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteFitnessDataById() {
    const data = await prisma.fitness_data.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
