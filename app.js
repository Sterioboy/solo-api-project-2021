const express = require("express");
const bodyParser = require("body-parser");

const session = require("express-session"); // библиотека для работы с сессиями // cookie-parser уже включен в express-session
const pgSessionStore = require("connect-pg-simple")(session); // импортируем экземпляр базы данных для хранения сессий

const path = require("path");
const morgan = require("morgan");
require("dotenv").config(); // подключаем чтение из файла .env

const app = express();

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views")); // Папка views
app.set("view engine", "hbs");

// импорт роутов
const indexRoute = require("./routes/indexRoute.js");

app.use(express.static("public")); // middlewares
app.use(express.json());
app.use(morgan("dev"));

// записывает переменную req.session.user, данные из session storage, относящиеся к прилетевшей куке.
//  если куки нету или она не найдена в session storage - req.session.user -> unfefined
app.use(
  session({
    name: "sid", // название куки
    store: new pgSessionStore({
      //  настройки для подключения к БД, которая хранит куки (в данном случае это та же самая БД, которую мы используем в проекте)
      conString:
        process.env.NODE_ENV === "production"
          ? process.env.DB_URL_PROD
          : process.env.DB_URL_DEV,
    }),
    secret: process.env.COOKIE_SECRET, // ключ для шифрования cookies // require('crypto').randomBytes(10).toString('hex')
    resave: false, // Если true,  пересохраняет сессию, даже если она не поменялась
    saveUninitialized: false, // Если false, куки появляются только при установке req.session
    cookie: {
      secure: process.env.NODE_ENV === "production", // В продакшне нужно "secure: true" для HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 10, // время жизни cookies, ms (10 дней)
    },
  })
);

//  сохраняем в обьект res.locals.username имя пользователя для  использования username в hbs
// app.use(userMiddleware);

app.use((req, res, next) => {
  console.log("file /middelware/user.js req.session.user :", req.session.user);
  if (req.session.user) res.locals.username = req.session?.user?.name;
  next();
});

app.use("/", indexRoute);

// Запуск сервера
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Сервер запущен. http://localhost:%s", port);
});
