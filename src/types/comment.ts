export interface Comment {
  id: string
  postId: string
  content: string
  author: string
  createdAt: string
  isGuest: boolean
  likes: number
  isLiked: boolean // 当前用户是否已点赞
  replyTo?: {
    id: string
    author: string
    content: string
  }
}

export interface CreateCommentDto {
  postId: string
  content: string
  author?: string
  replyToId?: string
}
