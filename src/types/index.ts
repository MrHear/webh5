// 工具项接口
export interface ToolItem {
  id: number
  name: string
  description: string
  icon: string
  url: string
  category: string
  color: string
}

// 生活日志接口
export interface LifeLog {
  id: number
  date: string
  time: string
  content: string
  type: 'work' | 'life' | 'study' | 'thought'
  mood?: string
}

// 服务器状态接口
export interface ServerStatus {
  cpu: number
  memory: number
  disk: number
  network: {
    upload: number
    download: number
  }
  uptime: string
  energy: number // 今日能量值
}

// 用户信息接口
export interface User {
  id: number
  name: string
  avatar: string
  role: string
}
