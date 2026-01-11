/**
 * 文章 API 服务
 */
import request from './index'
import type {
  ApiResponse,
  PaginatedData,
  PostInList,
  PostDetail,
  PostCreateRequest,
  PostUpdateRequest,
  PostCreateResponse,
  PostType
} from '@/types/api'

// 获取文章列表请求参数
export interface GetPostsParams {
  page?: number
  limit?: number
  type?: PostType
}

/**
 * 获取文章列表
 */
export function getPosts(params: GetPostsParams = {}) {
  return request.get<any, ApiResponse<PaginatedData<PostInList>>>('/v1/posts', { params })
}

/**
 * 获取文章详情
 */
export function getPostById(id: string) {
  return request.get<any, ApiResponse<PostDetail>>(`/v1/posts/${id}`)
}

/**
 * 创建文章（需要登录）
 */
export function createPost(data: PostCreateRequest) {
  return request.post<any, ApiResponse<PostCreateResponse>>('/v1/posts', data)
}

/**
 * 更新文章（需要登录）
 */
export function updatePost(id: string, data: PostUpdateRequest) {
  return request.put<any, ApiResponse<PostDetail>>(`/v1/posts/${id}`, data)
}

/**
 * 删除文章（需要登录）
 */
export function deletePost(id: string) {
  return request.delete<any, ApiResponse<null>>(`/v1/posts/${id}`)
}
