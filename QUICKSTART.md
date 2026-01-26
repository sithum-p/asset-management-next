# Quick Start Guide

## 🚀 Getting Your Asset Management System Running

### Step 1: Install MongoDB

#### Option A: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will run as a Windows Service automatically

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud - Free Tier Available)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local`:

   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/asset-management
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asset-management?retryWrites=true&w=majority
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 15+ framework
- MongoDB and Mongoose
- bcryptjs for password hashing
- All UI dependencies

### Step 4: Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Step 5: Verify Installation

1. **Check MongoDB Connection:**
   - Open your browser to `http://localhost:3000`
   - If there's a database connection error, check your MongoDB is running

2. **Verify MongoDB is Running:**
   
   **Local MongoDB:**
   ```bash
   # Windows (PowerShell)
   Get-Service MongoDB
   
   # macOS/Linux
   mongosh
   # Type: show dbs
   ```

### Step 6: Create Test Data (Optional)

You can use the API to create test data:

#### Create an Organization
```bash
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "address": "123 Main St, City",
    "phone": "+1234567890",
    "email": "contact@acme.com",
    "website": "https://acme.com"
  }'
```

#### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@acme.com",
    "password": "password123",
    "role": "admin",
    "organizationId": "YOUR_ORG_ID_HERE"
  }'
```

#### Create an Asset
```bash
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "assetTag": "AST-001",
    "name": "Dell Laptop",
    "category": "Laptop",
    "purchaseDate": "2024-01-01",
    "purchasePrice": 1200,
    "currentValue": 1200,
    "status": "available",
    "condition": "excellent",
    "organizationId": "YOUR_ORG_ID_HERE"
  }'
```

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

---

## 📁 Project Structure Overview

```
src/
├── actions/          # Server-side actions
├── app/
│   ├── api/          # REST API endpoints
│   └── components/   # React components
├── lib/              # Utilities (DB connection, etc.)
├── models/           # MongoDB schemas
└── types/            # TypeScript types
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   Get-Service MongoDB
   
   # macOS/Linux
   brew services list | grep mongodb
   ```

2. Verify connection string in `.env.local`
3. For Atlas: Check IP whitelist (0.0.0.0/0 for development)

### Issue: "Module not found"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Change port
PORT=3001 npm run dev

# Or kill the process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: TypeScript errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Or run type check
npx tsc --noEmit
```

---

## 📚 Next Steps

1. **Read the Documentation:**
   - [README.md](./README.md) - Full project documentation
   - [STRUCTURE.md](./STRUCTURE.md) - Detailed structure guide
   - [API.md](./API.md) - API reference

2. **Explore the Code:**
   - Check `/src/app/api/` for API routes
   - Look at `/src/models/` for database schemas
   - Review `/src/app/components/` for UI components

3. **Customize:**
   - Modify asset categories in `/src/config/constants.ts`
   - Customize UI components in `/src/app/components/ui/`
   - Add new features following the structure guide

4. **Add Authentication:**
   - Install NextAuth.js: `npm install next-auth`
   - Follow [NextAuth.js MongoDB Guide](https://next-auth.js.org/adapters/mongodb)

5. **Deploy:**
   - Build: `npm run build`
   - Deploy to Vercel: `vercel deploy`
   - Or use any Node.js hosting platform

---

## 🎯 Feature Checklist

- [x] MongoDB connection setup
- [x] RESTful API endpoints
- [x] Server actions
- [x] Database models
- [x] TypeScript types
- [ ] Authentication system
- [ ] File upload for images
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Export to CSV/PDF

---

## 💡 Tips

1. **Development:**
   - Use MongoDB Compass to visualize your database
   - Install React DevTools for debugging
   - Use Postman or Thunder Client for API testing

2. **Database:**
   - Regularly backup your MongoDB database
   - Use indexes for frequently queried fields
   - Monitor query performance

3. **Code Quality:**
   - Run ESLint before committing: `npm run lint`
   - Use TypeScript strict mode
   - Follow the established folder structure

---

## 📞 Need Help?

- Check existing components for examples
- Read the inline code comments
- Review the API documentation
- Examine the database models

---

## 🎉 You're Ready!

Your Asset Management System is now set up and running. Start by creating an organization, then add users and assets. Happy coding!
