#!/bin/sh
# Запускается перед каждым git push (через simple-git-hooks).

# git передаёт в stdin строки: <local ref> <local sha> <remote ref> <remote sha>
while read -r _ _ remote_ref _; do
  if [ "$remote_ref" = "refs/heads/main" ]; then
    echo "✖ Push в main запрещён. В main попадаем только через Pull Request."
    exit 1
  fi
done

# Проверка типов и сборка: в PR не уходит то, что не собирается.
npm run build
