import {
  wrapAsync,
  // sendEmail
} from './helpers';
import { OrderProps, EventProps } from '../../src/@types/types';
// import { ticketEmail } from './emailTemplates';
import { NextApiRequest } from 'next';

const updateTixCount = async (
  order: OrderProps,
  event: EventProps,
  db: any,
) => {
  let ops = {};
  Object.keys(order.cart).forEach((curr) => {
    ops[`ticketTypes.${curr}.sold`] = order.cart[curr].quantity;
  });

  order.date = new Date(order.date);
  await db.collection('tba-ticket').insertOne(order);

  return await db.collection('tba-event').updateOne(
    { slug: event.slug },
    {
      $inc: {
        gross: order.total,
        ...ops,
      },
      $push: {
        tickets: {
          $each: [order],
          $slice: 10,
          $sort: { date: 1 },
        },
      },
    },
  );
};

export default wrapAsync(async (req: NextApiRequest, db: any) => {
  const { event, order } = req.body;

  return await updateTixCount(order, event, db);
  // return await sendEmail([order.emailAddress], ticketEmail, event, order);
});
