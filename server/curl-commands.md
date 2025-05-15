# API Testing Commands

## User Operations

### Create a User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com"
  }'
```

### Get All Users (with sorting and filtering)
```bash
# Get all users sorted by creation date
curl http://localhost:3001/api/users?sortBy=createdAt&order=DESC

# Search users by username or email
curl http://localhost:3001/api/users?search=john

# Get all users sorted by username
curl http://localhost:3001/api/users?sortBy=username&order=ASC
```

### Get Specific User
```bash
curl http://localhost:3001/api/users/1
```

### Update User
```bash
curl -X PUT http://localhost:3001/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe_updated",
    "email": "john.updated@example.com"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3001/api/users/1
```

## Post Operations

### Create a Post
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post",
    "userId": 1
  }'
```

### Get All Posts (with sorting and filtering)
```bash
# Get all posts sorted by creation date
curl http://localhost:3001/api/posts?sortBy=createdAt&order=DESC

# Search posts by title or content
curl http://localhost:3001/api/posts?search=first

# Get posts by specific user
curl http://localhost:3001/api/posts?userId=1

# Combine filters
curl http://localhost:3001/api/posts?userId=1&sortBy=title&order=ASC
```

### Get Specific Post
```bash
curl http://localhost:3001/api/posts/1
```

### Update Post
```bash
curl -X PUT http://localhost:3001/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post Title",
    "content": "Updated post content"
  }'
```

### Delete Post
```bash
curl -X DELETE http://localhost:3001/api/posts/1
```

## Testing the Relationship

1. First create a user:
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com"
  }'
```

2. Create a post for that user:
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post",
    "userId": 1
  }'
```

3. Get the user with their posts:
```bash
curl http://localhost:3001/api/users/1
```

4. Get all posts with their authors:
```bash
curl http://localhost:3001/api/posts
``` 



run the script 
cd /Users/adriantrill/Desktop/model-forge/server
./test-api.sh


chmod +x test-api.sh
./test-api.sh


./demo.sh

jmeter -n -t stats-test-plan.jmx


node show-stats.js

cd server
rm -rf report results.jtl
jmeter -n -t stats-test-plan.jmx -l results.jtl -e -o report