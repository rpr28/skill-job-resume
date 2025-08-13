# 🔐 Password Storage System

## 📍 **Current Implementation (Development)**

### **Where Passwords Are Stored:**
- **Location**: `data/users.json` (local file system)
- **Format**: JSON file with encrypted passwords
- **Structure**: 
  ```json
  {
    "users": [
      {
        "id": "1234567890",
        "email": "user@example.com",
        "password": "$2a$12$hashedPasswordHere...",
        "name": "John Doe",
        "createdAt": "2025-01-13T02:34:00.000Z"
      }
    ],
    "updatedAt": "2025-01-13T02:34:00.000Z"
  }
  ```

### **Security Features:**
✅ **Password Hashing**: Using bcryptjs with 12 salt rounds  
✅ **No Plain Text**: Passwords are never stored as plain text  
✅ **Data Persistence**: Users survive server restarts  
✅ **File-based**: Simple JSON storage for development  

### **File Structure:**
```
src/
├── lib/
│   └── db.js              # Database operations
├── app/api/auth/
│   ├── signup/route.js    # User registration
│   ├── signin/route.js    # User authentication
│   └── verify/route.js    # Token verification
└── data/                  # User data storage
    └── users.json         # Encrypted user database
```

## 🚀 **Production Upgrades**

### **Option 1: PostgreSQL (Recommended)**
```bash
npm install pg @types/pg
```

**Database Schema:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### **Option 2: MongoDB**
```bash
npm install mongodb mongoose
```

**Schema:**
```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### **Option 3: Supabase (Firebase Alternative)**
```bash
npm install @supabase/supabase-js
```

## 🔒 **Security Best Practices**

### **Current Implementation:**
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation
- ✅ Error handling

### **Production Recommendations:**
- 🔒 **Environment Variables**: Move JWT_SECRET to `.env`
- 🔒 **Rate Limiting**: Implement API rate limiting
- 🔒 **HTTPS Only**: Force HTTPS in production
- 🔒 **Password Policy**: Enforce strong password requirements
- 🔒 **Session Management**: Implement refresh tokens
- 🔒 **Audit Logging**: Log authentication attempts

## 📁 **File Locations**

### **Database Operations:**
- **File**: `src/lib/db.js`
- **Purpose**: All database CRUD operations
- **Exports**: `readUsers`, `writeUsers`, `findUserByEmail`, etc.

### **API Endpoints:**
- **Signup**: `src/app/api/auth/signup/route.js`
- **Signin**: `src/app/api/auth/signin/route.js`
- **Verify**: `src/app/api/auth/verify/route.js`
- **Admin**: `src/app/api/admin/users/route.js`

### **Data Storage:**
- **File**: `data/users.json`
- **Git Ignored**: ✅ (not committed to version control)
- **Backup**: Consider automated backups for production

## 🧪 **Testing the System**

### **1. Create a User:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### **2. Sign In:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **3. View Users (Admin):**
```bash
curl http://localhost:3000/api/admin/users
```

## ⚠️ **Important Notes**

### **Development vs Production:**
- **Current**: File-based storage (good for development)
- **Production**: Use proper database (PostgreSQL, MongoDB, etc.)
- **Security**: Current system is secure but not scalable

### **Data Backup:**
- **Development**: `data/users.json` is your backup
- **Production**: Implement automated database backups
- **Migration**: Plan migration path from file to database

### **Environment Variables:**
```bash
# .env.local
JWT_SECRET=your-super-secure-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/careerboost
```

## 🔄 **Migration Path**

1. **Phase 1**: Current file-based system (✅ Complete)
2. **Phase 2**: Add environment variables for JWT_SECRET
3. **Phase 3**: Implement database (PostgreSQL recommended)
4. **Phase 4**: Add rate limiting and security headers
5. **Phase 5**: Production deployment with HTTPS

---

**Current Status**: ✅ **Development Ready**  
**Next Step**: Choose production database and implement migration


