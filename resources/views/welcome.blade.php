<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>ИдёмВКино</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

    <!-- Styles -->
    <link rel="stylesheet" href="/css/normalize.css">
    <link rel="stylesheet" href="/css/styles.css">
    <style>
        .center {
            display: flex;
            flex-direction: column;
            height: 100vh;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>

<body>
    <div class="center">
        <a href="/admin/login"><button class="conf-step__button conf-step__button-regular">Администратор</button></a>
        <a href="/client/index"><button class="conf-step__button conf-step__button-regular">Гость</button></a>
    </div>
</body>

</html>