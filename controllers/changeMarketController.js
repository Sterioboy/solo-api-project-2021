const { Block } = require("../db/models");

exports.changeMarket = async (req, res) => {
  const block = await Block.findOne({
    where: {
      user_ref: req.session.user.id,
    },
  });

  block.primary_market = req.body.primaryMarketInput;
  await block.save();

  res.redirect("/");
}
