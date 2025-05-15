#!/bin/bash

# Generate unique identifiers for this test run
TIMESTAMP=$(date +"%s")
TEST_USERNAME="john_doe_${TIMESTAMP}"
TEST_EMAIL="john_${TIMESTAMP}@example.com"

echo "=== Starting API Tests ==="
echo "Make sure the server is running on port 3001 before running this script!"
echo "Press Enter to continue..."
read

echo -e "\n=== Testing User Creation ==="
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"${TEST_USERNAME}\",
    \"email\": \"${TEST_EMAIL}\"
  }")
echo "$USER_RESPONSE"

# Extract user ID from response
USER_ID=$(echo "$USER_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
if [ -z "$USER_ID" ]; then
    echo "Error: Failed to create user"
    exit 1
fi

echo -e "\n\n=== Testing Get All Users (sorted by creation date) ==="
curl -s http://localhost:3001/api/users?sortBy=createdAt&order=DESC

echo -e "\n\n=== Testing User Search ==="
curl -s "http://localhost:3001/api/users?search=${TEST_USERNAME}"

echo -e "\n\n=== Testing User Sorting ==="
curl -s http://localhost:3001/api/users?sortBy=username&order=ASC

echo -e "\n\n=== Testing Get Specific User ==="
curl -s http://localhost:3001/api/users/$USER_ID

echo -e "\n\n=== Testing Post Creation ==="
POST_RESPONSE=$(curl -s -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"My First Post\",
    \"content\": \"This is the content of my first post\",
    \"userId\": $USER_ID
  }")
echo "$POST_RESPONSE"

# Extract post ID from response
POST_ID=$(echo "$POST_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
if [ -z "$POST_ID" ]; then
    echo "Error: Failed to create post"
    exit 1
fi

echo -e "\n\n=== Testing Get All Posts (sorted by creation date) ==="
curl -s http://localhost:3001/api/posts?sortBy=createdAt&order=DESC

echo -e "\n\n=== Testing Post Search ==="
curl -s http://localhost:3001/api/posts?search=first

echo -e "\n\n=== Testing Posts by User ==="
curl -s http://localhost:3001/api/posts?userId=$USER_ID

echo -e "\n\n=== Testing Combined Filters ==="
curl -s "http://localhost:3001/api/posts?userId=$USER_ID&sortBy=title&order=ASC"

echo -e "\n\n=== Testing Get Specific Post ==="
curl -s http://localhost:3001/api/posts/$POST_ID

echo -e "\n\n=== Testing Update User ==="
curl -s -X PUT http://localhost:3001/api/users/$USER_ID \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"${TEST_USERNAME}_updated\",
    \"email\": \"updated_${TEST_EMAIL}\"
  }"

echo -e "\n\n=== Testing Update Post ==="
curl -s -X PUT http://localhost:3001/api/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post Title",
    "content": "Updated post content"
  }'

echo -e "\n\n=== Testing Get User with Posts ==="
curl -s http://localhost:3001/api/users/$USER_ID

echo -e "\n\n=== Testing Get Posts with Authors ==="
curl -s http://localhost:3001/api/posts

echo -e "\n\n=== Testing Delete Post ==="
curl -s -X DELETE http://localhost:3001/api/posts/$POST_ID

echo -e "\n\n=== Testing Delete User ==="
curl -s -X DELETE http://localhost:3001/api/users/$USER_ID

echo -e "\n\n=== API Tests Completed ===" 