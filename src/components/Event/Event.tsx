import * as React from 'react';
import { useState } from 'react';
import FadeIn from 'react-fade-in';
import { stripeClient, formatEventTime } from '../../lib';
import { TicketCheckoutForm } from './TicketCheckoutForm';
import { UserCheckoutForm } from './UserCheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { EventProps } from '../../@types/types';

const stripePromise = loadStripe(stripeClient);

interface EventViewProps {
  event: EventProps;
}

export const Event: React.FunctionComponent<EventViewProps> = ({ event }) => {
  const [mode, setMode] = useState<number>(0);
  const [cart, setCart] = useState<any>({});
  const [total, setTotal] = useState<number>(0);

  let tixs = {};
  Object.keys(event.ticketTypes).map((curr) => {
    tixs[curr] = Object.assign({
      ticketName: event.ticketTypes[curr].ticketName,
      quantity: event.ticketTypes[curr].quantity,
      price: event.ticketTypes[curr].price,
    });
  });
  const [tickets] = useState<any>(tixs);
  // console.log(event);
  return (
    <Elements stripe={stripePromise}>
      <main className="mw9 ml4-ns center">
        <img className="w-100 center db" src={event.image} />

        <article className="dt-ns tc tl-ns w-90-l w-100-m  pb2 mv3">
          <div className="dtc-l  pt2-m  v-mid f3-l f5 fw7">
            <div className=" lh-title mb0 mt0-ns underline-hover">
              <a className="white no-underline f1-ns f2">{event.name}</a>
            </div>
            <div className="f4-ns f5 fw6 lh-title mv0 underline-hover">
              <a
                className="white no-underline"
                target="_blank"
                href={`https://www.google.com/maps/place/?q=place_id:${event.location.placeId}`}
              >
                {event.location.venue}
              </a>
            </div>
            <div className="f4-ns f5 fw6 lh-title mv0 underline-hover">
              <a
                className="white no-underline"
                target="_blank"
                href={`https://www.google.com/maps/place/?q=place_id:${event.location.placeId}`}
              >
                {`${event.location.address.split(',')[1]}, ${
                  event.location.address.split(',')[2].split(' ')[1]
                }`}{' '}
              </a>
            </div>
            <div className="f4-ns f5 fw6 mv0 gray">
              {`${formatEventTime(
                new Date(event.startDate),
                new Date(event.endDate)
              )}`}
            </div>
            <h2 className="f4-ns f5 fw6 mv0 green">• Live</h2>
          </div>
          <div className="dtc-l v-mid tr-l tc f2-l f3 fw6">
            <div
              onClick={() => setMode(1)}
              className=" dib-l bg-green  no-underline white noselect dim br-100  pa2 mr2 mt2-l ph4 mt2 "
            >
              Get Tickets
            </div>
          </div>
        </article>
        <div className="flex flex-wrap justify-between w-100 nr3 mv3 pv3">
          {mode === 2 && (
            <div className="w-100 dib">
              <FadeIn>
                <span className="f3-l f4 fw6-l fw4 br-100 b--solid pv2 ph3 mv4">
                  Checkout
                </span>

                <UserCheckoutForm
                  setMode={setMode}
                  total={total}
                  event={event}
                  cart={cart}
                />
              </FadeIn>
            </div>
          )}
          {mode === 1 && (
            <div className="w-100 dib">
              <FadeIn>
                <span className="f3-l f4 fw6-l fw4 br-100 b--solid pv2 ph3 mv4">
                  Tickets
                </span>
                <TicketCheckoutForm
                  cart={cart}
                  setCart={setCart}
                  ticketTypes={tickets}
                  setMode={setMode}
                  total={total}
                  setTotal={setTotal}
                />
              </FadeIn>
            </div>
          )}
          <div className=" dib">
            <FadeIn>
              <section className="fl w-48-l w-100 mv2 ">
                <div className=" pl0 mt3">
                  <span className="f3-l f4 fw6-l fw4 br-100 b--solid pv2 ph3 ">
                    Description
                  </span>
                  <div
                    className="pt2-ns mt2 pt1"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
              </section>
              <section className="fl w-48-l w-100 mv2 pl3-l">
                <div className="mt3 ">
                  <span className="f3-l f4 fw6-l fw4 br-100 b--solid pv2 ph3 ">
                    Line Up
                  </span>
                  <div className="pt2-ns mt4 pt1">
                    <img
                      className="db mw-100 "
                      src="https://wikibirthday.com/wp-content/uploads/2018/11/Chase-B-Wiki-Bio-Age-Height-Net-Worth-2018.jpg"
                      alt=""
                    />
                    <p>
                      <strong> OG Chase B, </strong>
                      <a
                        className="no-underline white"
                        href="https://instagram.com/ogchaseb"
                        target="_blank"
                      >
                        @ogchaseb
                      </a>
                      <br />
                    </p>
                    <img
                      className="db mw-100 "
                      src="https://images.squarespace-cdn.com/content/v1/53d1dfbae4b039a3a0158351/1571371316055-UBE44B0C76GNTAA38875/ke17ZwdGBToddI8pDm48kFWxnDtCdRm2WA9rXcwtIYR7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UcTSrQkGwCGRqSxozz07hWZrYGYYH8sg4qn8Lpf9k1pYMHPsat2_S1jaQY3SwdyaXg/675E1F44-FA8D-4762-8335-F862013AE729-10830-000009C3559CD954.JPG"
                      alt=""
                    />
                    <p>
                      <strong>Where's Nasty, </strong>
                      <a
                        className="no-underline white"
                        href="https://instagram.com/wheresnasty"
                        target="_blank"
                      >
                        @wheresnasty
                      </a>
                      <br />
                    </p>
                    <img
                      className="db mw-100 "
                      src="https://i1.sndcdn.com/avatars-000323351569-5jjgjf-t500x500.jpg"
                      alt=""
                    />
                    <p>
                      <strong>DJ Steph Cakes, </strong>
                      <a
                        className="no-underline white"
                        href="https://instagram.com/djstephcakes"
                        target="_blank"
                      >
                        @djstephcakes
                      </a>
                      <br />
                    </p>
                  </div>
                </div>
              </section>
            </FadeIn>
          </div>
        </div>
      </main>
    </Elements>
  );
};