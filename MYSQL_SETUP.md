# MySQL Setup Complete ✅

## Installation Summary

### What Was Installed
- **MySQL Version**: 9.5.0
- **Installed via**: Homebrew
- **Database Created**: `multi_ai_db`
- **Root Password**: None (default installation)

### Database Status
```
✅ MySQL Service: Running
✅ Database: multi_ai_db created
✅ Tables: users table created
✅ Prisma: Client generated and migrations applied
```

---

## Connection Details

### Current Configuration
```bash
Host: localhost
Port: 3306
User: root
Password: (none)
Database: multi_ai_db
```

### Connection String (Already Updated in .env)
```bash
DATABASE_URL="mysql://root@localhost:3306/multi_ai_db"
```

---

## Database Tables

### Users Table Structure
| Field | Type | Key | Extra |
|-------|------|-----|-------|
| id | int | PRIMARY | auto_increment |
| name | varchar(191) | | |
| phoneNo | varchar(191) | UNIQUE | |
| email | varchar(191) | UNIQUE | |
| password | varchar(191) | | |
| createdAt | datetime(3) | | DEFAULT NOW() |
| updatedAt | datetime(3) | | |

---

## MySQL Service Management

### Start MySQL
```bash
brew services start mysql
```

### Stop MySQL
```bash
brew services stop mysql
```

### Restart MySQL
```bash
brew services restart mysql
```

### Check MySQL Status
```bash
brew services list | grep mysql
```

### Connect to MySQL
```bash
# Connect to MySQL shell
mysql -u root

# Connect to specific database
mysql -u root multi_ai_db

# Run a query
mysql -u root multi_ai_db -e "SHOW TABLES;"
```

---

## Prisma Commands

### Generate Prisma Client
```bash
npx prisma generate
```

### Run Migrations
```bash
npx prisma migrate dev
```

### Reset Database
```bash
npx prisma migrate reset
```

### Open Prisma Studio (Database GUI)
```bash
npx prisma studio
```

This will open a browser interface at `http://localhost:5555` where you can view and edit your database records.

---

## Security Recommendations

### Set a Root Password (Recommended for Production)
```bash
# Run the secure installation wizard
mysql_secure_installation
```

This will guide you through:
1. Setting a root password
2. Removing anonymous user accounts
3. Disabling remote root login
4. Removing the test database
5. Reloading privilege tables

**If you set a password, update your .env file:**
```bash
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/multi_ai_db"
```

---

## Useful MySQL Commands

### Show All Databases
```bash
mysql -u root -e "SHOW DATABASES;"
```

### Show Tables in Current Database
```bash
mysql -u root multi_ai_db -e "SHOW TABLES;"
```

### View Table Structure
```bash
mysql -u root multi_ai_db -e "DESCRIBE users;"
```

### View All Users
```bash
mysql -u root multi_ai_db -e "SELECT * FROM users;"
```

### Count Users
```bash
mysql -u root multi_ai_db -e "SELECT COUNT(*) FROM users;"
```

### Delete All Users (⚠️ Careful!)
```bash
mysql -u root multi_ai_db -e "TRUNCATE TABLE users;"
```

---

## Troubleshooting

### MySQL Won't Start
```bash
# Check logs
brew services info mysql

# Try manual start
/opt/homebrew/opt/mysql/bin/mysqld_safe --datadir=/opt/homebrew/var/mysql
```

### Can't Connect
```bash
# Check if MySQL is running
brew services list | grep mysql

# Check port
lsof -i :3306

# Restart MySQL
brew services restart mysql
```

### Lost Root Password
```bash
# Stop MySQL
brew services stop mysql

# Start in safe mode
mysqld_safe --skip-grant-tables &

# Connect and reset password
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;

# Restart normally
brew services start mysql
```

### Database Connection Error in App
1. Check MySQL is running: `brew services list`
2. Verify DATABASE_URL in `.env` is correct
3. Test connection: `mysql -u root multi_ai_db -e "SELECT 1;"`
4. Regenerate Prisma client: `npx prisma generate`

---

## Backup and Restore

### Backup Database
```bash
mysqldump -u root multi_ai_db > backup.sql
```

### Restore Database
```bash
mysql -u root multi_ai_db < backup.sql
```

### Backup with Timestamp
```bash
mysqldump -u root multi_ai_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## Uninstall (If Needed)

### Stop and Remove MySQL
```bash
# Stop service
brew services stop mysql

# Uninstall
brew uninstall mysql

# Remove data (⚠️ This deletes everything!)
rm -rf /opt/homebrew/var/mysql
```

---

## Next Steps

1. ✅ MySQL is installed and running
2. ✅ Database `multi_ai_db` is created
3. ✅ Tables are created via Prisma migrations
4. ✅ `.env` is updated with correct connection

**You can now:**
- Start your backend server: `npm run dev`
- View your database: `npx prisma studio`
- Test API endpoints with the database

---

## Auto-Start on Boot

MySQL is already configured to start automatically when you log in. If you want to disable this:

```bash
# Disable auto-start
brew services stop mysql

# Start manually when needed
/opt/homebrew/opt/mysql/bin/mysqld_safe --datadir=/opt/homebrew/var/mysql
```

---

**MySQL Setup Complete! 🎉**
