import * as React from 'react';
import { useState } from 'react';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.us';
import { formatPrice } from '../../lib';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import {
  EventProps,
  OrderProps,
  EventCartProps,
} from '../../../src/@types/types';

interface EventCheckoutProps {
  setMode: any;
  total: number;
  event: EventProps;
  cart: {
    [ticketName: string]: EventCartProps;
  };
}

export const UserCheckoutForm: React.FunctionComponent<EventCheckoutProps> = ({
  total,
  event,
  cart,
  setMode,
}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const stripe = useStripe();

  const validateEmail = (mail: string) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      console.log('You have entered an valid email address!');
      return true;
    }
    console.log('You have entered an invalid email address!');
    return false;
  };

  const handleCheckout: React.FormEventHandler<HTMLSpanElement> = async (e) => {
    e.preventDefault();
    const order: OrderProps = {
      emailAddress,
      firstName,
      lastName,
      slug: event.slug,
      phoneNumber,
      total,
      date: new Date(),
      cart,
    };
    if (total >= 0) {
      const response = await axios.post('/api/ticket', {
        order,
        event,
      });
      console.log(response.data);
    } else {
      // Create a Checkout Session.
      const response = await axios.post('/api/stripe', {
        amount: total,
        eventName: event.name,
        slug: event.slug,
        emailAddress,
        image: event.image,
        cart,
      });

      if (response.data.statusCode === 500) {
        console.error(response.data.message);
        return;
      }

      // Redirect to Checkout.
      const { error } = await stripe!.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: response.data.id,
      });
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      console.warn(error.message);
    }
  };
  return (
    <div className="pv3 w-100">
      <form className="w-100 pt4 mw7 center">
        <div className="mv3">
          <label className="f5-ns f6 fw7-ns fw5 db pv2">First Name</label>

          <input
            value={firstName}
            className="bg-transparent white bb bt-0 br-0 bl-0 pa2 mr3 w-100"
            onChange={(e) => setFirstName(e.currentTarget.value)}
          />
        </div>
        <div className="mv3">
          <label className="f5-ns f6 fw7-ns fw5 db pv2">Last Name</label>

          <input
            value={lastName}
            className="bg-transparent white bb bt-0 br-0 bl-0 pa2 mr3 w-100"
            onChange={(e) => setLastName(e.currentTarget.value)}
          />
        </div>
        <div className="mv3">
          <label className="f5-ns f6 fw7-ns fw5 db pv2 ">Email Address</label>

          <input
            value={emailAddress}
            className="bg-transparent white bb bt-0 br-0 bl-0 pa2 mr3 w-100"
            onChange={(e) => {
              setEmailAddress(e.currentTarget.value);
              validateEmail(emailAddress);
            }}
          />
        </div>
        <div className="mv3">
          <label className="f5-ns f6 fw7-ns fw5 db pv2 ">Phone Number</label>

          <Cleave
            value={phoneNumber}
            options={{ phone: true, phoneRegionCode: 'US' }}
            className="bg-transparent white bb bt-0 br-0 bl-0 pa2 mr3 w-100"
            onChange={(e) => setPhoneNumber(e.currentTarget.value)}
          />
        </div>
        {
          <div className="dib w-100 ">
            <span className="fl pt2 f3-ns f4 db">
              Total: {formatPrice(total.toString())}
            </span>
            <span
              onClick={handleCheckout}
              className="b--white hover-bg-white hover-black dib noselect br-100 b--solid pa2 ph3 f3-l f4-m f5 fw5-ns ml fw6 fr"
            >
              {total > 0 ? `Pay` : `Next`}
            </span>{' '}
            <span
              onClick={() => setMode(1)}
              className="b--white hover-bg-white hover-black dib noselect br-100 b--solid pa2 ph3 f3-l f4-m f5 fw5-ns mr2 fw6 fr"
            >
              Back
            </span>
          </div>
        }
      </form>
    </div>
  );
};