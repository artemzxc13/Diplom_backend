# Explorer Backend
# 

## Проект доступен по адрессу 84.201.151.85 || api-news.tk
Валидация данных с помощью Joi/celebrate
Централизованная обработка ошибок
Логирование запросов и ошибок

### Как запустить его локально

    Клонировать репозиторий

$> git clone https://github.com/artemzxc13/Diplom_backend/level1/

    Установить зависимости

$> npm install

    Установить MongoDB 
    Вызвать скрипт запуска сервера

$> npm run start

или

$> npm run dev

    Сервер будел запущен локально, используя порт 3000 по умолчанию: http://localhost:3000
    NB: npm run dev запускает сервер с опцией hot reload.

 ### Использованные технологии
+ Node.js
+ Express.js
+ MongoDB
+ Mongoose
 
  ## Запуск
  | ЗАПРОС | ОТВЕТ | 
| :---         |     :---       |  
| POST `api-news.tk/signup`   | Регистрация нового пользователя     |
| POST `api-news.tk/signin`   | Логин     |
| GET `api-news.tk/users/me/`   | Получение информации о пользователе   |
| POST `api-news.tk/articles`     | Создание статьи. В ответ API должно возвращать 200 статус ответа и JSON с данными созданой cтатьи       | 
| GET `api-news.tk/articles`      | JSON-список всех статей    |
| DELETE `api-news.tk/articles/6w34defeuhed74u`     | Удаление статьи. В ответ API должно возвращать 200 статус ответа и JSON с данными       | 
| Несуществующий адрес     | `{ "message": "Запрашиваемый ресурс не найден" }`       | 
