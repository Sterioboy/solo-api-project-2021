const axios = require("axios").default;

exports.expandData = async (req, res) => {
  if (!req.session.user) {
    return res.render("index.hbs", { default: true });
  }

  //Economic Data
  //1. Real GDP
  const realGDPOptions = {
    method: "GET",
    url: "https://alpha-vantage.p.rapidapi.com/query",
    params: {
      function: "REAL_GDP",
      outputsize: "compact",
      datatype: "json",
    },
    headers: {
      "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
      "x-rapidapi-key": "d8432db7ccmsh693ba5c1ab2df80p11be78jsn3bb8ea622f07",
    },
  };

  const realGDP = await axios.request(realGDPOptions);
  const lastRefrashedRealGDP = {
    name: realGDP.data.name,
    unit: realGDP.data.unit,
    date: realGDP.data.data[0].date,
    value: realGDP.data.data[0].value,
  };
  //1. Real GDP *END*

  //2. Unemployemnet Rate
  const uneploymentOptions = {
    method: "GET",
    url: "https://alpha-vantage.p.rapidapi.com/query",
    params: {
      function: "UNEMPLOYMENT",
      outputsize: "compact",
      datatype: "json",
    },
    headers: {
      "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
      "x-rapidapi-key": "d8432db7ccmsh693ba5c1ab2df80p11be78jsn3bb8ea622f07",
    },
  };

  const unemployment = await axios.request(uneploymentOptions);
  const lastRefrashedUnemployment = {
    name: unemployment.data.name,
    unit: unemployment.data.unit,
    date: unemployment.data.data[0].date,
    value: unemployment.data.data[0].value,
  };
  //2. Unemployemnet Rate *END*

  //3. Inflation Exp.
  const inflationOptions = {
    method: "GET",
    url: "https://alpha-vantage.p.rapidapi.com/query",
    params: {
      function: "INFLATION_EXPECTATION",
      outputsize: "compact",
      datatype: "json",
    },
    headers: {
      "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
      "x-rapidapi-key": "d8432db7ccmsh693ba5c1ab2df80p11be78jsn3bb8ea622f07",
    },
  };

  const inflation = await axios.request(inflationOptions);
  const lastRefrashedInflation = {
    name: inflation.data.name,
    unit: inflation.data.unit,
    date: inflation.data.data[0].date,
    value: inflation.data.data[0].value,
  };
  //3. Inflation Exp. *END*

  res.json([lastRefrashedRealGDP, lastRefrashedUnemployment, lastRefrashedInflation]);
};
