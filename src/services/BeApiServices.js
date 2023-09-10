const resources = {
  resourceCountries: "countries",
  resourceStates: "states",
  resourceCities: "cities",
  resourceLoads: "loads",
};

class BEApiServices {
  constructor(options) {
    this.apiURL = options.apiURL;
    this.axios = options.axios;
  }

  saveFromJsonFile() {
    let url = resources.resourceLoads;
    let method = "post";

    return this.axios({
      method,
      url,
    }).then((resp) => {
      return resp.data;
    });
  }

  countriesFindAll(id) {
    return this.axios.get(resources.resourceCountries).then((resp) => {
      return resp.data || [];
    });
  }

  countriesFindStates(id) {
    return this.axios
      .get(`${resources.resourceCountries}/${id}/states`)
      .then((resp) => {
        return resp.data || [];
      });
  }

  statesFindSCities(id) {
    return this.axios
      .get(`${resources.resourceStates}/${id}/cities`)
      .then((resp) => {
        return resp.data || [];
      });
  }

  citiesDelete(id) {
    return this.axios
      .delete(`${resources.resourceCities}/${id}`)
      .then((resp) => {
        return resp.data || [];
      });
  }

  getEnvs() {
    return Promise.resolve(resources);
  }
}

export default BEApiServices;
