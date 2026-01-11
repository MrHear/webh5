import request from './index'
import type { ApiResponse } from '@/types/api'
import type { Comment, CreateCommentDto } from '@/types/comment'

export const commentApi = {
  // 获取文章评论
  getComments(postId: string, sortBy: 'time' | 'likes' = 'time') {
    return request.get<any, ApiResponse<Comment[]>>('/v1/comments', {
      params: { postId, sort: sortBy }
    })
  },

  // 发表评论
  createComment(data: CreateCommentDto) {
    return request.post<any, ApiResponse<Comment>>('/v1/comments', data)
  },

  // 点赞评论
  likeComment(commentId: string) {
    return request.post<any, ApiResponse<{ isLiked: boolean, likes: number }>>(`/v1/comments/${commentId}/like`)
  }
}
