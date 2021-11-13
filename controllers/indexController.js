const { User } = require("../db/models");
const { Block } = require("../db/models");
const axios = require("axios").default;

exports.renderDefault = async (req, res, next) => {
  if (!req.session.user) {
    return res.render("index.hbs", { default: true });
  } else {
    next();
  }
};

exports.renderTerminal = async (req, res) => {
  const block = await Block.findOne({
    where: {
      user_ref: req.session.user.id,
    },
  });

  let marketData;
  let lastRefrashed;
  let lastRefrashedMarketData;

  //Check Market -> Render Main Currency || V2.0 -> Create Form for search ||
  if (block.primary_market === "Stock Market") {
    const options = {
      method: "GET",
      url: "https://alpha-vantage.p.rapidapi.com/query",
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: "FB",
        outputsize: "compact",
        datatype: "json",
      },
      headers: {
        "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
        "x-rapidapi-key": "d8432db7ccmsh693ba5c1ab2df80p11be78jsn3bb8ea622f07",
      },
    };

    //
    marketData = await axios.request(options);
    lastRefrashed = String(
      marketData.data["Meta Data"]["3. Last Refreshed"]
    ).slice(0, 10);
    lastRefrashedMarketData = {
      symbol: marketData.data["Meta Data"]["2. Symbol"],
      exchange: "NASDAQ",
      open: marketData.data["Time Series (Daily)"][lastRefrashed]["1. open"],
      high: marketData.data["Time Series (Daily)"][lastRefrashed]["2. high"],
      low: marketData.data["Time Series (Daily)"][lastRefrashed]["3. low"],
      volume:
        marketData.data["Time Series (Daily)"][lastRefrashed]["5. volume"],
    };
    //
  } else if (block.primary_market === "ForEx") {
    const options = {
      method: "GET",
      url: "https://alpha-vantage.p.rapidapi.com/query",
      params: {
        from_symbol: "EUR",
        function: "FX_DAILY",
        to_symbol: "USD",
        outputsize: "compact",
        datatype: "json",
      },
      headers: {
        "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
        "x-rapidapi-key": "d8432db7ccmsh693ba5c1ab2df80p11be78jsn3bb8ea622f07",
      },
    };
    //
    marketData = await axios.request(options);
    lastRefrashed = String(
      marketData.data["Meta Data"]["5. Last Refreshed"]
    ).slice(0, 10);
    lastRefrashedMarketData = {
      symbol: `${marketData.data["Meta Data"]["2. From Symbol"]}USD`,
      exchange: "FX",
      open: marketData.data["Time Series FX (Daily)"][lastRefrashed]["1. open"],
      high: marketData.data["Time Series FX (Daily)"][lastRefrashed]["2. high"],
      low: marketData.data["Time Series FX (Daily)"][lastRefrashed]["3. low"],
      volume:
        marketData.data["Time Series FX (Daily)"][lastRefrashed]["4. volume"],
    };
    //
  } else if (block.primary_market === "Cryptocurrencies") {
    var options = {
      method: "GET",
      url: "https://alpha-vantage.p.rapidapi.com/query",
      params: {
        market: "USD",
        symbol: "BTC",
        function: "DIGITAL_CURRENCY_DAILY",
      },
      headers: {
        "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
        "x-rapidapi-key": "d8432db7ccmsh693ba5c1ab2df80p11be78jsn3bb8ea622f07",
      },
    };
    //
    marketData = await axios.request(options);
    lastRefrashed = String(
      marketData.data["Meta Data"]["6. Last Refreshed"]
    ).slice(0, 10);
    lastRefrashedMarketData = {
      symbol: `${marketData.data["Meta Data"]["2. Digital Currency Code"]}USD`,
      exchange: "COINBASE",
      open: marketData.data["Time Series (Digital Currency Daily)"][
        lastRefrashed
      ]["1a. open (USD)"],
      high: marketData.data["Time Series (Digital Currency Daily)"][
        lastRefrashed
      ]["2a. high (USD)"],
      low: marketData.data["Time Series (Digital Currency Daily)"][
        lastRefrashed
      ]["3a. low (USD)"],
      volume:
        marketData.data["Time Series (Digital Currency Daily)"][lastRefrashed][
          "5. volume"
        ],
    };
    //
  }

  res.render("index.hbs", {
    //Market Data
    symbol: lastRefrashedMarketData.symbol,
    exchange: lastRefrashedMarketData.exchange,
    open: Math.round(lastRefrashedMarketData.open * 100) / 100,
    high: Math.round(lastRefrashedMarketData.high * 100) / 100,
    low: Math.round(lastRefrashedMarketData.low * 100) / 100,
    volume: Math.round(lastRefrashedMarketData.volume * 100) / 100,
  });
};
