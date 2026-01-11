/**
 * 认证 API 服务
 */
import request from './index'
import type { ApiResponse, LoginRequest, LoginResponse } from '@/types/api'

/**
 * 管理员登录
 */
export function login(data: LoginRequest) {
  return request.post<any, ApiResponse<LoginResponse>>('/v1/auth/login', data)
}
