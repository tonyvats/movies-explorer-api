# movies-explorer-api

## Ручки

`GET /users/me` — возвращает информацию о пользователе (email и имя)  
`PATCH /users/me` — обновляет информацию о пользователе (email и имя)
`GET /movies` — возвращает все сохранённые пользователем фильмы
`POST /movies` — создаёт фильм с переданными в теле: country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
`DELETE /movies/movieId ` — удаляет сохранённый фильм по _id
  

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

Ссылки:
Домен - https://api.vatc.movies.nomoredomains.icu
Публичный адресс - 130.193.58.136
