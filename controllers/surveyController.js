const { User } = require("../db/models");
const { Block } = require("../db/models");

exports.checkSignIn = async (req, res) => {
  //Check Authorization
  if (!req.session.user) {
    return res.redirect("/");
  }

  //Check if survey has been passed before
  const passed = await User.findOne({
    where: {
      id: req.session.user.id,
    },
  });

  if(passed.survey === true) {
    return res.redirect("/");
  }

  res.render("survey.hbs");
};

exports.sendSurveyData = async (req, res) => {
  console.log(req.body);

  //Change survey=true in Users Table
  const passed = await User.findOne({
    where: {
      id: req.session.user.id,
    },
  });
  passed.survey = true;
  await passed.save();

  //Create new block with preferences
  const block = await Block.create({
    user_ref: req.session.user.id,
    experienced: req.body.experienceInput === "false" ? false : true,
    primary_market: req.body.primaryMarketInput,
    trading_style: req.body.tradingStyleInput,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(block);
  res.redirect("/");
};
