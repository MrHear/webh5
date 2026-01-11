/**
 * 文件上传 API 服务
 */
import request from './index'
import type { ApiResponse, UploadResponse } from '@/types/api'

/**
 * 上传图片（需要登录）
 */
export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return request.post<any, ApiResponse<UploadResponse>>('/v1/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
