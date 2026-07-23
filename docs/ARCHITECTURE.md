# MATHO — Architecture Guide

This document explains the Phase 1 foundation architecture: why it's shaped
this way, and where future business logic will attach. Eleven diagrams cover
structure, flows, and deployment.

## Principles

Clean Architecture, Domain-Driven Design boundaries, SOLID, a modular
monorepo, and mobile-first, Pi-native UX. Concretely, that means:

- **Apps depend on packages, never the reverse.** `apps/web`, `apps/admin`,
  and `apps/api` all consume `packages/*`; no package imports from `apps/*`.
- **The UI package has zero framework lock-in beyond React.** It never
  imports `next/link` or Nest decorators, so it can be reused by any future
  React surface (e.g. a native shell) without modification.
- **The streaming and payment vendors are never hardcoded.** `packages/sdk`
  defines interfaces; concrete providers are swapped via configuration.
- **One Prisma schema, one source of truth.** `packages/types` mirrors it at
  the type level so the frontend never needs the Prisma client directly.

---

## 1. Overall monorepo structure

```mermaid
graph TD
    Root["matho/ (npm workspaces + Turborepo)"]
    Root --> Apps
    Root --> Packages
    Root --> Docs["docs/"]
    Root --> Infra["infrastructure/"]
    Root --> CI[".github/workflows/"]

    Apps --> Web["apps/web (Next.js)"]
    Apps --> Admin["apps/admin (Next.js)"]
    Apps --> Api["apps/api (NestJS)"]

    Packages --> UI["packages/ui"]
    Packages --> Types["packages/types"]
    Packages --> Sdk["packages/sdk"]
    Packages --> Shared["packages/shared"]
    Packages --> Database["packages/database"]
    Packages --> Config["packages/config"]

    Web --> UI
    Web --> Types
    Web --> Sdk
    Web --> Shared
    Admin --> UI
    Admin --> Types
    Admin --> Shared
    Api --> Types
    Api --> Sdk
    Api --> Shared
    Api --> Database
```

## 2. Clean Architecture layers (apps/api)

```mermaid
graph TD
    subgraph "Interface layer"
        Controllers["Controllers (HTTP, DTO validation)"]
    end
    subgraph "Application layer"
        Services["Services (use cases — Phase 2)"]
        Guards["Guards / Filters (auth, error normalization)"]
    end
    subgraph "Domain layer"
        Entities["Domain types (packages/types)"]
    end
    subgraph "Infrastructure layer"
        Prisma["PrismaService (packages/database)"]
        SdkLayer["Pi SDK + streaming providers (packages/sdk)"]
        Postgres[("PostgreSQL")]
        Redis[("Redis")]
    end

    Controllers --> Services
    Controllers --> Guards
    Services --> Entities
    Services --> Prisma
    Services --> SdkLayer
    Prisma --> Postgres
    SdkLayer -.future.-> Redis
```

## 3. Folder hierarchy

```mermaid
graph LR
    A["apps/web/src"] --> A1["app/ (routes)"]
    A --> A2["components/ (AppShell)"]
    A --> A3["lib/ (api-client, providers, cart-store)"]

    B["apps/api/src"] --> B1["modules/ (10 feature modules)"]
    B --> B2["common/ (guards, filters)"]
    B --> B3["prisma/ (PrismaService)"]
    B --> B4["config/"]

    C["packages/ui/src"] --> C1["components/"]
    C --> C2["theme/"]
    C --> C3["utils/"]

    D["packages/database"] --> D1["prisma/schema.prisma"]
    D --> D2["prisma/seed.ts"]
    D --> D3["src/client.ts"]
```

## 4. Authentication flow (target design, Phase 2)

```mermaid
sequenceDiagram
    participant U as User (Pi Browser)
    participant W as apps/web
    participant SDK as packages/sdk (Pi auth)
    participant API as apps/api Auth module
    participant Pi as Pi Platform API

    U->>W: Tap "Continue with Pi"
    W->>SDK: authenticateWithPi(scopes)
    SDK->>Pi: Pi.authenticate() (client SDK)
    Pi-->>SDK: accessToken + piUid + username
    SDK-->>W: PiAuthResult
    W->>API: POST /auth/pi (accessToken)
    API->>Pi: GET /v2/me (verify token)
    Pi-->>API: verified profile
    API->>API: upsert User + Profile (Prisma)
    API-->>W: MATHO JWT (access + refresh)
    W->>W: store session, redirect to /home
```

## 5. Pi SDK placeholder flow (current, Phase 1)

```mermaid
graph TD
    Login["Login page button"] --> Call["authenticateWithPi() stub"]
    Call --> Throw["Throws: 'Phase 1 placeholder'"]
    Throw --> Toast["UI shows a toast — no crash"]

    Checkout["Checkout page"] -.future.-> Payments["createPiPayment() stub"]
    Payments --> Throw2["Throws: 'Phase 1 placeholder'"]

    style Throw fill:#fee2e2
    style Throw2 fill:#fee2e2
```

## 6. Frontend routing (apps/web)

```mermaid
graph TD
    Root["/"] --> Login["/login"]
    Root --> Main["(main) layout — AppShell"]
    Main --> Home["/home"]
    Main --> Live["/live"]
    Main --> Market["/marketplace"]
    Main --> Product["/product/[id]"]
    Main --> Store["/store/[id]"]
    Main --> Cart["/cart"]
    Main --> Checkout["/checkout"]
    Main --> Orders["/orders"]
    Main --> Profile["/profile"]
    Main --> Merchant["/merchant"]
    Main --> Affiliate["/affiliate"]
    Main --> Settings["/settings"]
    Main --> Notifications["/notifications"]
```

## 7. Backend modules (apps/api)

```mermaid
graph LR
    AppModule --> Auth
    AppModule --> Users
    AppModule --> Merchant
    AppModule --> Products
    AppModule --> Orders
    AppModule --> Payments
    AppModule --> Live
    AppModule --> Affiliate
    AppModule --> Notifications
    AppModule --> Admin
    AppModule --> PrismaModule

    Orders -.future dependency.-> Payments
    Orders -.future dependency.-> Products
    Affiliate -.future dependency.-> Products
    Live -.future dependency.-> Merchant
```

## 8. Database ER diagram

```mermaid
erDiagram
    User ||--o| Profile : has
    User ||--o{ Store : owns
    User ||--o{ Order : places
    User ||--o{ Livestream : hosts
    User ||--o{ AffiliateLink : creates
    User ||--o{ Notification : receives
    User ||--o{ Review : writes
    User ||--o{ Follow : follows

    Store ||--o{ Product : lists
    Store ||--o{ Order : fulfills
    Store ||--o{ Livestream : streams

    Category ||--o{ Product : classifies
    Category ||--o{ Category : "parent of"

    Product ||--o{ ProductVariant : has
    Product ||--o{ OrderItem : "ordered as"
    Product ||--o{ AffiliateLink : promoted_by
    Product ||--o{ Review : reviewed_in

    Order ||--o{ OrderItem : contains
    Order ||--o| Payment : "paid via"
    Order ||--o{ Commission : generates

    AffiliateLink ||--o{ Commission : earns
```

## 9. Deployment architecture

```mermaid
graph TD
    subgraph "Vercel"
        Web["apps/web"]
        Admin["apps/admin"]
    end
    subgraph "Railway / Docker host"
        Api["apps/api (NestJS)"]
        PG[("PostgreSQL")]
        Redis[("Redis")]
        S3[("S3-compatible storage")]
    end
    Web --> Api
    Admin --> Api
    Api --> PG
    Api --> Redis
    Api --> S3
    Web -.static assets.-> S3
```

## 10. CI/CD pipeline

```mermaid
graph LR
    PR["Pull request"] --> Lint["Lint + format check"]
    PR --> Typecheck["Typecheck"]
    PR --> Test["Unit tests (Postgres service container)"]
    Lint --> Build["Build all apps"]
    Typecheck --> Build
    Test --> Build
    Build --> E2E["Playwright e2e"]
    E2E --> Merge["Merge to main"]
    Merge --> Deploy["Deploy: Vercel (web/admin) + Railway (api)"]
```

## 11. Future microservices architecture

```mermaid
graph TD
    subgraph "Today: modular monolith (apps/api)"
        M1[Auth] & M2[Products] & M3[Orders] & M4[Payments] & M5[Live] & M6[Affiliate]
    end

    subgraph "Future: extracted services (only if scale demands it)"
        S1["Payments Service"]
        S2["Live/Streaming Service"]
        S3["Notifications Service"]
        Gateway["API Gateway"]
        Queue[("Message queue — e.g. Redis Streams / SQS")]
    end

    M4 -.extract when payment volume/PCI scope grows.-> S1
    M5 -.extract when concurrent viewers scale.-> S2
    Notifications -.extract for fan-out at scale.-> S3
    Gateway --> S1
    Gateway --> S2
    Gateway --> S3
    S1 & S2 & S3 --> Queue
```

---

## Why these choices (and what we rejected)

- **npm workspaces + Turborepo**, not Nx or Lerna: Turborepo's task caching
  is enough for this repo's size, and npm workspaces avoids a second package
  manager. Nx's plugin system is more than Phase 1 needs.
- **NestJS**, not raw Express: the module system maps directly onto DDD
  bounded contexts (Auth, Products, Orders, ...) and gives us DI, guards, and
  OpenAPI generation for free — all of which a hand-rolled Express app would
  need to reinvent.
- **Prisma over TypeORM**: stronger TypeScript inference, simpler migrations,
  and a schema that doubles as living documentation of the domain.
- **A provider-agnostic streaming interface from day one**: live commerce is
  the platform's core differentiator, and locking into one vendor before
  Phase 1 even ships would be a costly mistake to unwind later.
- **UI package with no Next.js imports**: keeps the design system portable
  and testable in isolation (Vitest + Testing Library), independent of any
  one app's routing.
