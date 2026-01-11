# OneSpace 博客系统接口文档 (API Documentation)

本文档定义了 OneSpace 博客系统前后端交互的标准 RESTful API 接口。

## 1. 基础说明

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **时间格式**: ISO 8601 (YYYY-MM-DDTHH:mm:ss)
- **认证方式**: Bearer Token (JWT)

---

## 2. 数据模型 (Models)

### Post (文章)

| 字段名 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `id` | string | 文章唯一标识 (UUID) | `"550e8400-e29b-41d4-a716-446655440000"` |
| `title` | string | 文章标题 | `"Vue3 深度解析"` |
| `summary` | string | 文章摘要 (用于列表展示) | `"本文深入探讨 Vue3 的响应式原理..."` |
| `content` | string | 文章正文 (Markdown 或 HTML) | `"# 标题\n内容..."` |
| `type` | string | 文章类型 | `"markdown"` 或 `"richtext"` |
| `tags` | string[] | 标签列表 | `["技术", "前端"]` |
| `views` | number | 阅读量 | `1024` |
| `createdAt` | string | 创建时间 | `"2026-01-10T12:00:00"` |

---

## 3. 接口定义 (Endpoints)

### 3.1 获取文章列表

获取博客首页的时间轴文章列表。

- **URL**: `/posts`
- **Method**: `GET`
- **认证**: 不需要
- **Query Parameters (可选)**:
    - `page`: number (页码，默认 1，范围 1-1000)
    - `limit`: number (每页数量，默认 10，范围 1-100)
    - `type`: string (筛选类型: 'markdown' | 'richtext')

**响应示例 (200 OK):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "list": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "神经网络与赛博植入体技术解析",
        "summary": "探索2077年生物神经元与硅基芯片之间的接口技术发展...",
        "type": "markdown",
        "tags": ["技术", "赛博义体"],
        "createdAt": "2077-09-12T10:30:00",
        "views": 1240
      }
    ]
  }
}
```

---

### 3.2 获取文章详情

根据 ID 获取单篇文章的完整内容。

- **URL**: `/posts/{id}`
- **Method**: `GET`
- **认证**: 不需要
- **Path Parameters**:
    - `id`: string (文章 UUID)

**响应示例 (200 OK):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "神经网络与赛博植入体技术解析",
    "summary": "探索2077年生物神经元与硅基芯片之间的接口技术发展...",
    "content": "# 神经网络与赛博植入体技术解析\n\n**人类**与**机器**的界限日益模糊...",
    "type": "markdown",
    "tags": ["技术", "赛博义体"],
    "createdAt": "2077-09-12T10:30:00",
    "views": 1241
  }
}
```

**错误响应 (404 Not Found):**

```json
{
  "detail": "文章不存在"
}
```

---

### 3.3 创建新文章

发布一篇新的 Markdown 或富文本文章。

- **URL**: `/posts`
- **Method**: `POST`
- **认证**: 需要 Bearer Token
- **Request Body**:

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `title` | string | 是 | 标题 (1-200字符) |
| `content` | string | 是 | 正文内容 (1-500000字符) |
| `summary` | string | 是 | 摘要 (1-500字符) |
| `type` | string | 是 | `'markdown'` 或 `'richtext'` |
| `tags` | string[] | 否 | 标签列表 (最多10个) |

**请求示例:**

```json
{
  "title": "新的灵感",
  "content": "<p>今天天气不错...</p>",
  "summary": "今天天气不错...",
  "type": "richtext",
  "tags": ["随笔"]
}
```

**响应示例 (201 Created):**

```json
{
  "code": 201,
  "message": "文章发布成功",
  "data": {
    "id": "new-uuid-1234",
    "createdAt": "2026-01-10T14:30:00"
  }
}
```

---

### 3.4 更新文章

- **URL**: `/posts/{id}`
- **Method**: `PUT`
- **认证**: 需要 Bearer Token
- **Path Parameters**:
    - `id`: string (文章 UUID)
- **Request Body**: 支持部分更新

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `title` | string | 否 | 标题 |
| `content` | string | 否 | 正文内容 |
| `summary` | string | 否 | 摘要 |
| `type` | string | 否 | `'markdown'` 或 `'richtext'` |
| `tags` | string[] | 否 | 标签列表 |

**响应示例 (200 OK):**

```json
{
  "code": 200,
  "message": "文章更新成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "更新后的标题",
    "summary": "更新后的摘要",
    "content": "更新后的内容...",
    "type": "markdown",
    "tags": ["技术"],
    "createdAt": "2077-09-12T10:30:00",
    "views": 1240
  }
}
```

---

### 3.5 删除文章

软删除文章（数据不会真正删除）。

- **URL**: `/posts/{id}`
- **Method**: `DELETE`
- **认证**: 需要 Bearer Token
- **Path Parameters**:
    - `id`: string (文章 UUID)

**响应示例 (200 OK):**

```json
{
  "code": 200,
  "message": "文章删除成功",
  "data": null
}
```

---

### 3.6 管理员登录

- **URL**: `/auth/login`
- **Method**: `POST`
- **认证**: 不需要
- **速率限制**: 每分钟 5 次
- **Request Body**:

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `username` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

**请求示例:**

```json
{
  "username": "admin",
  "password": "your_password"
}
```

**响应示例 (200 OK):**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

**错误响应 (401 Unauthorized):**

```json
{
  "detail": "用户名或密码错误"
}
```

---

### 3.7 图片上传

用于编辑器中上传图片。

- **URL**: `/upload`
- **Method**: `POST`
- **认证**: 需要 Bearer Token
- **Content-Type**: `multipart/form-data`
- **Request Body**: `file` (图片文件)
- **支持格式**: JPEG, PNG, GIF, WebP
- **大小限制**: 由服务器配置决定（默认 5MB）

**响应示例 (200 OK):**

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "/uploads/2026/01/abc123-def456.jpg",
    "filename": "abc123-def456.jpg",
    "size": 102400,
    "mime_type": "image/jpeg"
  }
}
```

---

## 4. 错误码说明

| 状态码 | 说明 |
| :--- | :--- |
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（需要登录） |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 413 | 文件过大 |
| 415 | 不支持的文件类型 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

---

## 5. 速率限制

| 接口 | 限制 |
| :--- | :--- |
| GET /posts | 30次/分钟 |
| GET /posts/{id} | 60次/分钟 |
| POST /posts | 10次/分钟 |
| PUT /posts/{id} | 20次/分钟 |
| DELETE /posts/{id} | 10次/分钟 |
| POST /auth/login | 5次/分钟 |
| POST /upload | 10次/分钟 |

---

## 6. 前端对接指南

### 6.1 配置 API 基础 URL

在 `.env` 或 `.env.local` 文件中配置：

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 6.2 API 服务位置

- `src/api/index.ts` - Axios 实例配置
- `src/api/posts.ts` - 文章 API
- `src/api/auth.ts` - 认证 API
- `src/api/upload.ts` - 上传 API

### 6.3 状态管理

- `src/stores/posts.ts` - 文章状态管理
- `src/stores/auth.ts` - 认证状态管理

### 6.4 类型定义

- `src/types/api.ts` - API 相关类型定义
