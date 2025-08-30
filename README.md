## Installation With Docker

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sbayce/Library-Management-System.git
   ```

2. **Install dependencies**

   ```bash
   cd Library-Management-System
   ```

3. **Run**
   ```bash
   docker compose up --build
   ```

## Installation Without Docker

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sbayce/Library-Management-System.git
   ```

2. **Install dependencies**

   ```bash
   cd Library-Management-System
   npm install
   ```

3. **Apply Prisma Migrations**
   ```bash
   npx prisma migrate deploy
   ```
4. **Start server**

   ```bash
   npm run dev
   ```

## Documentation

https://documenter.getpostman.com/view/21420884/2sB3HhrhDu

# File structure

```bash
├── Prisma
│   └── schema.prisma          # Prisma schema file
├── src
│   ├── controllers
│   │   ├── analytics          # Endpoints for exporting .csv files
│   │   ├── book
│   │   ├── borrower
│   │   └── borrowing
│   ├── routes
│   │   ├── analytics.ts
│   │   ├── book.ts
│   │   ├── borrower.ts
│   │   └── borrowing.ts
│   ├── middleware
│   │   ├── error-handler.ts   # Global error handler
│   │   └── validation.ts      # Middleware request validators
│   ├── schemas                # Zod schemas for validation
│   │   ├── analytics.ts
│   │   ├── book.ts
│   │   ├── borrower.ts
│   │   ├── borrowing.ts
│   │   ├── pagination.ts
│   │   └── params.ts
│   ├── db.ts
│   ├── errors.ts              # Custom error classes
│   └── index.ts               # Main entry point
```
