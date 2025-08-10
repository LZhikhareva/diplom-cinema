# Компоненты проекта:
- npm 10.2.4
- PHP 8.4.5 (cli) (built: Mar 12 2025 12:19:37) (ZTS Visual C++ 2022 x64)
- Composer version 2.8.9 2025-05-13 14:01:37
- Laravel Framework 10.48.29

# План по разворачиванию проекта:
1. Склонировать проект с помощью команды `git clone https://github.com/LZhikhareva/diplom-cinema.git` и открыть в IDE
2. Выполнить в терминале команды для установки зависимостей `npm install` и `composer install`
3. Создать файла окружения .env из .env.example и сделать настройки БД (DB_CONNECTION=sqlite, DB_DATABASE=database\database.sqlite) 
4. Cоздать файл базы данных database\database.sqlite
5. Выполнить в терминале команды для генерации APP_KEY в env-файле `php artisan key:generate`, для применения миграций `php artisan migrate` и для наполнителей `php artisan db:seed`
6. Выполнить команду `php artisan storage:link` для создания символической ссылки для корректного отображения загруженных постеров
7.  Выполнить в терминале команду для запуска локального сервера `php artisan serve`. Главная страница предоставляет возможность войти как в админскую часть (доступы: логин `demo@mail.ru`, пароль `12345678`), так и в пользовательскую


# Основные таблицы:
## Залы - halls
## Фильмы - movies
## Сеансы - sessions
## Места - seats
