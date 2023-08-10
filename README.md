# Django Tests

```bash
yarn run compile
vsce package # creates the vsix which we can install locally
# https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token
# https://dev.azure.com/dajimenezriv/
# The token needs permissions for marketplace
vsce login dajimenezriv
# https://marketplace.visualstudio.com/manage/publishers/dajimenezriv
vsce publish
```

settings.json
```json
{
  "django-tests.app": "naranjas_daniel",
  "django-tests.command": "docker compose exec wsgi_backend python manage.py test"
}
```
