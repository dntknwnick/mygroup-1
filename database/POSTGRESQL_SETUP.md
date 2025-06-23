# PostgreSQL Installation and Setup Guide

## Step 1: Install PostgreSQL

### Windows Installation:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow these settings:
   - **Port**: 5432 (default)
   - **Superuser password**: Choose a strong password (remember this!)
   - **Locale**: Default
3. Make sure to install pgAdmin (PostgreSQL administration tool)
4. Add PostgreSQL to your system PATH

### Verify Installation:
```bash
psql --version
```

## Step 2: Create Database

1. Open Command Prompt as Administrator
2. Connect to PostgreSQL:
```bash
psql -U postgres
```
3. Enter your superuser password when prompted
4. Create the database:
```sql
CREATE DATABASE my_group_db;
```
5. Connect to the new database:
```sql
\c my_group_db;
```

## Step 3: Run Database Schema

Execute the SQL script located in `database/schema.sql` to create all tables:

```bash
psql -U postgres -d my_group_db -f database/schema.sql
```

## Step 4: Insert Sample Data

Execute the sample data script:

```bash
psql -U postgres -d my_group_db -f database/sample_data.sql
```

## Step 5: Configure Environment Variables

Create a `.env` file in the project root with your database credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_group_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## Default Database Credentials

- **Host**: localhost
- **Port**: 5432
- **Database**: my_group_db
- **Username**: postgres
- **Password**: [Your chosen password during installation]

## Troubleshooting

1. **Connection Issues**: Make sure PostgreSQL service is running
2. **Permission Issues**: Run Command Prompt as Administrator
3. **Path Issues**: Add PostgreSQL bin directory to system PATH
4. **Firewall**: Allow PostgreSQL through Windows Firewall (port 5432)
