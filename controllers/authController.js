const { User } = require("../db/models");
const bcrypt = require("bcrypt");

function failAuth(res, info) {
  return res.render("error-page", {
    error: info,
  });
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
  };
}

exports.createUserAndSession = async (req, res, next) => {
  const { name, password, email } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  //Проверка существует ли пользователь
  const checkUser = await User.findOne({ where: { email: email } });
  console.log(checkUser);
  if (checkUser) {
    return failAuth(res, "Пользователь с таким Email уже существует.")
  }

  const user = await User.create({
    name,
    password: hashedPassword,
    email,
  });

  // записываем в req.session.user данные (id & name) (создаем сессию)
  req.session.user = { id: user.id, name: user.name };
  console.log(req.session.user);

  res.redirect("/survey");
};

exports.checkUserAndSession = async (req, res) => {
  const { email, password } = req.body;
  // Ищем пользователя в БД
  const user = await User.findOne({ where: { email: email }, raw: true });
  if (!user) {
    return failAuth(res, "Пользователь не найден. Проверьте Email.");
  }

  // Сравниваем хэш в БД с хэшем введённого пароля
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return failAuth(res, "Пользователь не найден. Проверьте Password.");
  }

  // записываем в req.session.user данные (id & name) (создаем сессию)
  req.session.user = { id: user.id, name: user.name };
  console.log(req.session.user);

  if(user.survey != true){
    return res.redirect("/survey");
  }
  else {
    return res.redirect("/");
  }
};

exports.destroySession = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("sid");
    res.redirect("/");
  });
};
