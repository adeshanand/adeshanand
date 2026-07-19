import { useEffect, useState } from 'react';
import { useRevealedContact } from './useRevealedContact.js';

/*
 * Hire Me dials on phones and emails everywhere else. Detected by UA, not
 * viewport: "Mobi" appears on iPhone/Android handsets but not on iPads,
 * Android tablets, or desktops — a width breakpoint would misroute
 * landscape phones (>768px) and narrow desktop windows.
 */
export function useHireContact() {
  const { emailHref, phoneHref } = useRevealedContact();
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    setIsPhone(/Mobi/i.test(navigator.userAgent));
  }, []);
  return { hireHref: isPhone ? phoneHref : emailHref, isPhone, emailHref };
}
