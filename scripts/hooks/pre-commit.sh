#!/bin/sh
# Запускается перед каждым git commit (через simple-git-hooks).

if [ "$(git branch --show-current)" = "main" ]; then
  echo "✖ Коммит в main запрещён. Создай ветку под задачу: /start-task или git switch -c <тип>/<имя>"
  exit 1
fi

# Проверяем только файлы, которые попадают в коммит.
npx biome check --staged --no-errors-on-unmatched
