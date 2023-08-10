# Django Tests

```bash
yarn run compile
vsce package # creates the vsix which we can install locally
vsce login dajimenezriv
vsce publish
```

settings.json
```json
{
  "django-tests.app": "naranjas_daniel",
  "django-tests.command": "docker compose exec wsgi_backend python manage.py test"
}
```
