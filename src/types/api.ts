/**
 * API 响应类型定义
 * 与后端 schemas.py 保持一致
 */

// 文章类型枚举
export type PostType = 'markdown' | 'richtext'

// 通用 API 响应格式
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 分页数据格式
export interface PaginatedData<T> {
  total: number
  page: number
  list: T[]
}

// 文章列表项（不含 content）
export interface PostInList {
  id: string
  title: string
  summary: string
  type: PostType
  tags: string[]
  views: number
  createdAt: string
}

// 文章详情（含 content）
export interface PostDetail extends PostInList {
  content: string
}

// 创建文章请求
export interface PostCreateRequest {
  title: string
  summary: string
  content: string
  type: PostType
  tags?: string[]
}

// 更新文章请求
export interface PostUpdateRequest {
  title?: string
  summary?: string
  content?: string
  type?: PostType
  tags?: string[]
}

// 创建文章响应数据
export interface PostCreateResponse {
  id: string
  createdAt: string
}

// 登录请求
export interface LoginRequest {
  username: string
  // 生产环境务必使用 HTTPS 加密传输，防止明文泄露
  password: string
}

// 登录响应数据
export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

// 上传响应数据
export interface UploadResponse {
  url: string
  filename: string
  size: number
  mime_type: string
}
