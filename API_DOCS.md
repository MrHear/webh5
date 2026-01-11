# MindSpace API 文档

本文档描述了 MindSpace 博客系统的后端接口规范。

**Base URL**: `/api/v1` (具体视部署环境而定)

## 1. 文章 (Posts)

### 1.1 获取文章列表

- **URL**: `/posts`
- **Method**: `GET`
- **Query Params**:
  - `page`: 当前页码 (默认 1)
  - `limit`: 每页数量 (默认 10)
  - `type`: 文章类型 (`markdown` | `richtext`)
  - `keyword`: 搜索关键词 (可选)

**Response**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "list": [
      {
        "id": "uuid",
        "title": "文章标题",
        "summary": "文章摘要...",
        "type": "markdown",
        "tags": ["tag1", "tag2"],
        "views": 100,
        "createdAt": "2026-01-11T12:00:00Z"
      }
    ]
  }
}
```

### 1.2 获取文章详情

- **URL**: `/posts/:id`
- **Method**: `GET`

**Response**:
```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "title": "文章标题",
    "content": "# Markdown 内容",
    "summary": "...",
    "type": "markdown",
    "tags": [],
    "views": 101,
    "createdAt": "..."
  }
}
```

### 1.3 创建文章 (Auth)

- **URL**: `/posts`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "title": "标题",
  "content": "内容",
  "summary": "摘要",
  "type": "markdown",
  "tags": ["tag1"]
}
```

### 1.4 更新文章 (Auth)

- **URL**: `/posts/:id`
- **Method**: `PUT`
- **Body**: 同创建文章 (字段可选)

### 1.5 删除文章 (Auth)

- **URL**: `/posts/:id`
- **Method**: `DELETE`

---

## 2. 评论 (Comments)

### 2.1 获取文章评论

- **URL**: `/comments`
- **Method**: `GET`
- **Query Params**:
  - `postId`: 文章ID (Required)
  - `sort`: 排序方式 (`time` | `likes`) - 默认 `time`

**Response**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "c1",
      "postId": "p1",
      "content": "评论内容",
      "author": "访客A",
      "createdAt": "2026-01-11T12:30:00Z",
      "isGuest": true,
      "likes": 5,
      "isLiked": false, // 当前用户是否点赞状态
      "replyTo": {
        "id": "c0",
        "author": "访客B",
        "content": "原评论内容..."
      }
    }
  ]
}
```

### 2.2 发表评论

- **URL**: `/comments`
- **Method**: `POST`
- **Body**:
```json
{
  "postId": "文章ID",
  "content": "评论内容",
  "author": "昵称 (可选)",
  "replyToId": "被回复的评论ID (可选)"
}
```

**Response**:
```json
{
  "code": 201,
  "data": {
    "id": "new_id",
    ... // 完整评论对象
  }
}
```

### 2.3 点赞评论

- **URL**: `/comments/:id/like`
- **Method**: `POST`
- **Body**: `{}` (Empty)

**Response**:
```json
{
  "code": 200,
  "data": {
    "isLiked": true,
    "likes": 6
  }
}
```

---

## 3. 系统 & 文件

### 3.1 登录

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "admin",
  "password": "password"
}
```

### 3.2 文件上传 (Auth)

- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (Binary)

**Response**:
```json
{
  "code": 200,
  "data": {
    "url": "https://...",
    "filename": "image.png"
  }
}
```
