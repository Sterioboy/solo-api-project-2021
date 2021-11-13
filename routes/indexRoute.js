const express = require("express");
const {
  checkUserAndSession,
  createUserAndSession,
  destroySession,
} = require("../controllers/authController");
const { checkSignIn, sendSurveyData} = require("../controllers/surveyController");
const { renderDefault, renderTerminal } = require("../controllers/indexController");
const { changeMarket } = require("../controllers/changeMarketController");
const { expandData } = require("../controllers/expandDataController");

const router = express.Router();

router.get("/", renderDefault, renderTerminal);
router.get("/expandData", expandData);

router.post("/signup", createUserAndSession);
router.post("/signin", checkUserAndSession);

//Survey - Done!
router.get("/survey", checkSignIn);
router.post("/survey", sendSurveyData);

//Change Market
router.post("/changeMarket", changeMarket);

router.get("/signout", destroySession);

module.exports = router;
