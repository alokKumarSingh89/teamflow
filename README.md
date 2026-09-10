# TeamFlow

Production-oriented multi-tenant collaboration platform built with NestJS.

## Architecture

TeamFlow demonstrates:

- NestJS
- TypeScript
- GraphQL
- GraphQL Federation
- PostgreSQL
- Prisma
- Redis
- Kafka
- Transactional Outbox
- Event-driven architecture
- Authentication with AuthCore
- RBAC and permissions
- Multi-tenancy
- DataLoader
- GraphQL subscriptions
- Testing
- Observability
- Docker
- CI/CD

## Applications

| Application         | Responsibility               |
| ------------------- | ---------------------------- |
| user-subgraph       | Users, organizations, teams  |
| project-subgraph    | Projects and labels          |
| task-subgraph       | Tasks, comments and activity |
| notification-worker | Asynchronous notifications   |

## Shared Libraries

| Library     | Responsibility         |
| ----------- | ---------------------- |
| config      | Configuration          |
| logger      | Structured logging     |
| auth-client | AuthCore integration   |
| events      | Shared event contracts |

## Development

Install dependencies:

```bash
npm install
```
