/*
 * Contact details are stored in fragments and assembled at runtime so the
 * plain address/number never appears verbatim in the HTML source or as a
 * single greppable string in the bundle — a deterrent against harvesting
 * bots that scrape static output for mailto:/tel: patterns.
 */
const EMAIL_PARTS = ['adeshanand', '.', 'developer', '@', 'gmail', '.', 'com'];
const PHONE_PARTS = ['+91', '74831', '47340'];

export function buildEmail() {
  return EMAIL_PARTS.join('');
}

export function buildEmailHref() {
  return ['mail', 'to:'].join('') + buildEmail();
}

export function buildPhoneDisplay() {
  return PHONE_PARTS.join(' ');
}

export function buildPhoneHref() {
  return ['te', 'l:'].join('') + PHONE_PARTS.join('');
}
