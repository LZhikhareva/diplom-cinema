<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ИдёмВКино</title>
  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/styles.css">
  <link
    href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext"
    rel="stylesheet">
</head>

<body>
  <header class="page-header">
    <h1 class="page-header__title">Идём<span>в</span>кино</h1>
  </header>

  <input class="data-halls" type="hidden" value="{{ json_encode($halls) }}" />
  <input class="data-movies" type="hidden" value="{{ json_encode($movies) }}" />
  <input class="data-seances" type="hidden" value="{{ json_encode($seances) }}" />
  <input class="data-sales" type="hidden" value='@json(["is_open" => (bool) $isOpen])' />

  <nav class="page-nav">

  </nav>

  <main id="movies-container">

  </main>

  <script type="module" src="/js/client/client.js"></script>
</body>

</html>