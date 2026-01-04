import request from './index'
import type { ServerStatus, LifeLog } from '@/types'

// 获取服务器状态
export const getServerStatus = () => {
  return request.get<any, ServerStatus>('/server/status')
}

// 获取生活日志
export const getLifeLogs = (params?: { page?: number; pageSize?: number }) => {
  return request.get<any, LifeLog[]>('/logs', { params })
}

// 创建日志
export const createLog = (data: Omit<LifeLog, 'id'>) => {
  return request.post<any, LifeLog>('/logs', data)
}

// 更新日志
export const updateLog = (id: number, data: Partial<LifeLog>) => {
  return request.put<any, LifeLog>(`/logs/${id}`, data)
}

// 删除日志
export const deleteLog = (id: number) => {
  return request.delete<any, void>(`/logs/${id}`)
}
