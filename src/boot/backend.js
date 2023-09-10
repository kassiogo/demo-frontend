import { boot } from 'quasar/wrappers';
import BEApiServicesPlugin from 'src/services/BEApiServicesPlugin';
import Axios from 'axios';

let apiURL = process.env.OVERRIDE_API_URL;
if (!apiURL) {
  let loc = window.location;
  let portString = loc.port.trim() === '' ? '' : `:${loc.port}`;
  let appname = loc.hostname.split('.').slice(1).join('.');
  apiURL = `${loc.protocol}//api.${appname}${portString}`;
}
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const axios = Axios.create({
  baseURL: apiURL,
  // timeout: 10000
});

const pluginOptionsObject = {
  apiURL,
  axios,
  router: null,
};

export default boot(({ app, router, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  pluginOptionsObject.router = router;
  pluginOptionsObject.vueStore = store;
  app.use(BEApiServicesPlugin, pluginOptionsObject);
});

export { axios };
