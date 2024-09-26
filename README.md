# Library-Management-System

## Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sbayce/Library-Management-System.git
2. **Install dependencies**

   ```bash
   cd Library-Management-System
   npm install

3. **Create .env file and add the DATABASE_URL variable**
      ```bash
      //example  postgres://YourUserName:YourPassword@localhost:5432/DB_name
5. **Generate Prisma Client**
    
   ```bash
   npx prisma generate
6. **Run server**
   
   ```bash
   npm start
