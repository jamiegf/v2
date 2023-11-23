import { authenticatorUrls } from 'src/environments/urls/authenticator-urls';
import { getAddress } from 'src/environments/urls/get-address';
import { middlewareUrls } from 'src/environments/urls/middlware-urls';

export const environment = {
  production: false,
  local: false,
  absoluteUrl: 'http://stg-v2.mipools.com',
  authenticatorUrl: 'https://stg-authenticator.mipools.com',
  api: {
    middleware: middlewareUrls,
    authenticator: authenticatorUrls,
  },
  configUrl: '/assets/config.json',
  getAddress: getAddress,
};
