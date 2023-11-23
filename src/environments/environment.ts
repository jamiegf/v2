import { authenticatorUrls } from 'src/environments/urls/authenticator-urls';
import { getAddress } from 'src/environments/urls/get-address';
import { middlewareUrls } from 'src/environments/urls/middlware-urls';

export const environment = {
  production: true,
  local: false,
  absoluteUrl: 'https://mipools.com',
  authenticatorUrl: 'https://authenticator.mipools.com',
  api: {
    middleware: middlewareUrls,
    authenticator: authenticatorUrls,
  },
  configUrl: '/assets/config.json',
  getAddress: getAddress,
};
