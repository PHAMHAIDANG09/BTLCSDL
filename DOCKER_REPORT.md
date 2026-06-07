# Chay demo bang Docker

## Trang thai hien tai da kiem tra

- FE: http://localhost:3006
- BE API: http://localhost:3005/api
- Swagger: http://localhost:3005/api/docs
- SQL Server: localhost,1435
- Redis: localhost,6380

## Lenh dung khi bao cao

Neu DB/Redis cu dang co san va dang healthy, chay BE/FE:

```powershell
docker compose -f docker-compose.apps.yml up -d
```

Kiem tra trang thai:

```powershell
docker ps --filter name=nexthr
```

Xem log neu can:

```powershell
docker logs -f nexthr-be
docker logs -f nexthr-fe
```

Dung BE/FE:

```powershell
docker compose -f docker-compose.apps.yml down
```

## Build lai image BE/FE neu co sua code

```powershell
docker compose build be
docker compose build fe
docker compose -f docker-compose.apps.yml up -d
```

## Chay full stack tu dau

Chi dung lenh nay khi da tat/xoa stack cu `nexthr-db`, `nexthr-redis` de tranh conflict ten container va port:

```powershell
docker compose up -d
```

Neu bi bao conflict `nexthr-db` hoac `nexthr-redis`, nghia la DB/Redis cu van dang chay. Khi do dung file app-only:

```powershell
docker compose -f docker-compose.apps.yml up -d
```
