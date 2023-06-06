import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { goalValidationSchema } from 'validationSchema/goals';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.goal
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getGoalById();
    case 'PUT':
      return updateGoalById();
    case 'DELETE':
      return deleteGoalById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGoalById() {
    const data = await prisma.goal.findFirst(convertQueryToPrismaUtil(req.query, 'goal'));
    return res.status(200).json(data);
  }

  async function updateGoalById() {
    await goalValidationSchema.validate(req.body);
    const data = await prisma.goal.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteGoalById() {
    const data = await prisma.goal.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
