// import AuthServices from 'src/services/AuthServices';
import BEApiServices from "src/services/BeApiServices";

const BEApiServicesPlugin = {
  // The install method is all that needs to exist on the plugin object.
  // It takes the global Vue object as well as user-defined options.
  install(app, options) {
    options = options || {};
    options.apiURL = options.apiURL || "http://localhost:8080";
    const beApiServices = new BEApiServices(options);
    // const authServices = new AuthServices(options);

    console.log('rodando plugin"');
    app.provide("beApiServices", beApiServices);
    // app.provide('authServices', authServices);
    // authServices.setupInterceptors(options.axios);

    // app.config.globalProperties.$authServices = authServices;
  },
};

export default BEApiServicesPlugin;
