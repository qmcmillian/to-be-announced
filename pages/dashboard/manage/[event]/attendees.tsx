import * as React from 'react';
import { NextPage } from 'next';
import { Attendees } from '../../../../src/components/Dashboard/';
import { Layout } from '../../../../src/components/Layout/';
import axios from 'axios';
import absoluteUrl from 'next-absolute-url';
import { EventProps } from '../../../../src/@types/types';

interface Props {
  event: EventProps;
  tickets: any;
}

const Page: NextPage<Props> = ({ event, tickets }) => (
  <Layout>
    <div className="mw9 center pv2 ph3-ns overflow-hidden" id="dashboard">
      <section className="flex-m flex-l nl3-m nr3-m nl3-l nr3-l">
        <Attendees tickets={tickets} event={event} />
      </section>
    </div>
  </Layout>
);

Page.getInitialProps = async (ctx) => {
  const { origin } = absoluteUrl(ctx.req);
  const { event } = ctx.query;
  const eventResponse = await axios.get(`${origin}/api/event/${event}`);
  const ticketsResponse = await axios.get(`${origin}/api/tickets/${event}`);
  const eventResult = eventResponse.data;
  const ticketResult = ticketsResponse.data;
  return {
    event: eventResult[0],
    tickets: ticketResult,
  };
};

export default Page;
