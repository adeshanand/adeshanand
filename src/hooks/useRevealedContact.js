import { useEffect, useState } from 'react';
import {
  buildEmail,
  buildEmailHref,
  buildPhoneDisplay,
  buildPhoneHref,
} from '../lib/contact.js';

/*
 * Contact values are revealed only after mount, so they never exist in the
 * initial DOM a non-JS scraper would see.
 */
export function useRevealedContact() {
  const [contact, setContact] = useState({
    email: null,
    emailHref: '#contact',
    phone: null,
    phoneHref: '#contact',
  });

  useEffect(() => {
    setContact({
      email: buildEmail(),
      emailHref: buildEmailHref(),
      phone: buildPhoneDisplay(),
      phoneHref: buildPhoneHref(),
    });
  }, []);

  return contact;
}
