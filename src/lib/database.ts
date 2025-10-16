// Supabase数据库服务层
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

// 类型定义
export interface UserProfile {
  id: string
  username: string
  display_name?: string
  avatar_url?: string
  bio?: string
  level: string
  total_poems: number
  total_likes: number
  total_collections: number
  created_at: string
  updated_at: string
}

export interface ClassicPoem {
  id: string
  title: string
  author: string
  dynasty: string
  content: string
  category: string
  style?: string
  theme?: string
  translation?: string
  annotation?: string
  appreciation?: string
  difficulty_level: number
  popularity_score: number
  view_count: number
  like_count: number
  collection_count: number
  created_at: string
  updated_at: string
}

export interface UserPoem {
  id: string
  user_id: string
  title: string
  content: string
  style: string
  theme?: string
  emotions?: string[]
  keywords?: string[]
  is_ai_assisted: boolean
  ai_prompt?: string
  status: 'draft' | 'published' | 'private'
  view_count: number
  like_count: number
  comment_count: number
  collection_count: number
  share_count: number
  created_at: string
  updated_at: string
  published_at?: string
  // 关联数据
  user_profile?: UserProfile
  is_liked?: boolean
  is_collected?: boolean
}

export interface PoemComment {
  id: string
  user_id: string
  poem_id: string
  content: string
  parent_id?: string
  like_count: number
  created_at: string
  updated_at: string
  // 关联数据
  user_profile?: UserProfile
  replies?: PoemComment[]
}

export interface CreationChallenge {
  id: string
  title: string
  description: string
  theme?: string
  style?: string
  start_date: string
  end_date?: string
  participant_count: number
  status: 'active' | 'ended' | 'draft'
  created_by: string
  created_at: string
}

// 数据库服务类
export class DatabaseService {
  // 用户相关
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('获取用户配置失败:', error)
      return null
    }
    
    return data
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
    
    if (error) {
      console.error('更新用户配置失败:', error)
      return false
    }
    
    return true
  }

  // 经典诗词相关
  static async getClassicPoems(options: {
    category?: string
    author?: string
    dynasty?: string
    search?: string
    limit?: number
    offset?: number
  } = {}): Promise<{ data: ClassicPoem[], count: number }> {
    let query = supabase
      .from('classic_poems')
      .select('*', { count: 'exact' })
      .order('popularity_score', { ascending: false })

    if (options.category) {
      query = query.eq('category', options.category)
    }
    
    if (options.author) {
      query = query.eq('author', options.author)
    }
    
    if (options.dynasty) {
      query = query.eq('dynasty', options.dynasty)
    }
    
    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,author.ilike.%${options.search}%,content.ilike.%${options.search}%`)
    }
    
    if (options.limit) {
      query = query.limit(options.limit)
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('获取经典诗词失败:', error)
      return { data: [], count: 0 }
    }

    return { data: data || [], count: count || 0 }
  }

  static async getClassicPoemById(id: string, userId?: string): Promise<ClassicPoem | null> {
    const { data, error } = await supabase
      .from('classic_poems')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('获取诗词详情失败:', error)
      return null
    }

    // 增加浏览量
    await supabase
      .from('classic_poems')
      .update({ view_count: data.view_count + 1 })
      .eq('id', id)

    return data
  }

  // 用户诗词相关
  static async getUserPoems(options: {
    userId?: string
    status?: string
    search?: string
    limit?: number
    offset?: number
    includeProfile?: boolean
  } = {}): Promise<{ data: UserPoem[], count: number }> {
    let query = supabase
      .from('user_poems')
      .select(`
        *,
        ${options.includeProfile ? 'user_profile:user_profiles(*)' : ''}
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    if (options.userId) {
      query = query.eq('user_id', options.userId)
    }
    
    if (options.status) {
      query = query.eq('status', options.status)
    } else {
      // 默认只显示已发布的诗词
      query = query.eq('status', 'published')
    }
    
    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%,theme.ilike.%${options.search}%`)
    }
    
    if (options.limit) {
      query = query.limit(options.limit)
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('获取用户诗词失败:', error)
      return { data: [], count: 0 }
    }

    return { data: data || [], count: count || 0 }
  }

  static async createUserPoem(poem: Omit<UserPoem, 'id' | 'view_count' | 'like_count' | 'comment_count' | 'collection_count' | 'share_count' | 'created_at' | 'updated_at'>): Promise<UserPoem | null> {
    const { data, error } = await supabase
      .from('user_poems')
      .insert(poem)
      .select()
      .single()

    if (error) {
      console.error('创建诗词失败:', error)
      return null
    }

    return data
  }

  static async updateUserPoem(id: string, updates: Partial<UserPoem>): Promise<boolean> {
    const { error } = await supabase
      .from('user_poems')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('更新诗词失败:', error)
      return false
    }

    return true
  }

  static async deleteUserPoem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_poems')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('删除诗词失败:', error)
      return false
    }

    return true
  }

  // 点赞相关
  static async toggleLike(userId: string, poemId: string, poemType: 'classic' | 'user'): Promise<boolean> {
    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from('poem_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('poem_id', poemId)
      .eq('poem_type', poemType)
      .single()

    if (existingLike) {
      // 取消点赞
      const { error } = await supabase
        .from('poem_likes')
        .delete()
        .eq('id', existingLike.id)
      
      return !error
    } else {
      // 添加点赞
      const { error } = await supabase
        .from('poem_likes')
        .insert({
          user_id: userId,
          poem_id: poemId,
          poem_type: poemType
        })
      
      return !error
    }
  }

  static async checkUserLike(userId: string, poemId: string, poemType: 'classic' | 'user'): Promise<boolean> {
    const { data } = await supabase
      .from('poem_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('poem_id', poemId)
      .eq('poem_type', poemType)
      .single()

    return !!data
  }

  // 收藏相关
  static async toggleCollection(userId: string, poemId: string, poemType: 'classic' | 'user', collectionName?: string): Promise<boolean> {
    // 检查是否已收藏
    const { data: existingCollection } = await supabase
      .from('poem_collections')
      .select('id')
      .eq('user_id', userId)
      .eq('poem_id', poemId)
      .eq('poem_type', poemType)
      .single()

    if (existingCollection) {
      // 取消收藏
      const { error } = await supabase
        .from('poem_collections')
        .delete()
        .eq('id', existingCollection.id)
      
      return !error
    } else {
      // 添加收藏
      const { error } = await supabase
        .from('poem_collections')
        .insert({
          user_id: userId,
          poem_id: poemId,
          poem_type: poemType,
          collection_name: collectionName || '默认收藏夹'
        })
      
      return !error
    }
  }

  static async getUserCollections(userId: string, poemType?: 'classic' | 'user'): Promise<any[]> {
    let query = supabase
      .from('poem_collections')
      .select(`
        *,
        classic_poem:classic_poems(*),
        user_poem:user_poems(*, user_profile:user_profiles(*))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (poemType) {
      query = query.eq('poem_type', poemType)
    }

    const { data, error } = await query

    if (error) {
      console.error('获取收藏失败:', error)
      return []
    }

    return data || []
  }

  // 评论相关
  static async getPoemComments(poemId: string): Promise<PoemComment[]> {
    const { data, error } = await supabase
      .from('poem_comments')
      .select(`
        *,
        user_profile:user_profiles(*)
      `)
      .eq('poem_id', poemId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取评论失败:', error)
      return []
    }

    // 获取回复
    for (const comment of data || []) {
      const { data: replies } = await supabase
        .from('poem_comments')
        .select(`
          *,
          user_profile:user_profiles(*)
        `)
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true })

      comment.replies = replies || []
    }

    return data || []
  }

  static async createComment(comment: {
    user_id: string
    poem_id: string
    content: string
    parent_id?: string
  }): Promise<PoemComment | null> {
    const { data, error } = await supabase
      .from('poem_comments')
      .insert(comment)
      .select(`
        *,
        user_profile:user_profiles(*)
      `)
      .single()

    if (error) {
      console.error('创建评论失败:', error)
      return null
    }

    return data
  }

  // 创作挑战相关
  static async getCreationChallenges(status?: string): Promise<CreationChallenge[]> {
    let query = supabase
      .from('creation_challenges')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('获取创作挑战失败:', error)
      return []
    }

    return data || []
  }

  static async participateInChallenge(challengeId: string, userId: string, poemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('challenge_participations')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        poem_id: poemId
      })

    if (error) {
      console.error('参与挑战失败:', error)
      return false
    }

    // 更新挑战参与人数
    await supabase.rpc('increment_challenge_participants', { challenge_id: challengeId })

    return true
  }

  // 搜索相关
  static async searchAll(query: string, limit: number = 20): Promise<{
    classicPoems: ClassicPoem[]
    userPoems: UserPoem[]
  }> {
    const [classicResult, userResult] = await Promise.all([
      this.getClassicPoems({ search: query, limit: Math.ceil(limit / 2) }),
      this.getUserPoems({ search: query, limit: Math.ceil(limit / 2), includeProfile: true })
    ])

    return {
      classicPoems: classicResult.data,
      userPoems: userResult.data
    }
  }

  // 统计相关
  static async getUserStats(userId: string): Promise<{
    totalPoems: number
    totalLikes: number
    totalCollections: number
    totalViews: number
  }> {
    const { data: poems } = await supabase
      .from('user_poems')
      .select('like_count, collection_count, view_count')
      .eq('user_id', userId)

    if (!poems) {
      return { totalPoems: 0, totalLikes: 0, totalCollections: 0, totalViews: 0 }
    }

    const totalLikes = poems.reduce((sum, poem) => sum + poem.like_count, 0)
    const totalCollections = poems.reduce((sum, poem) => sum + poem.collection_count, 0)
    const totalViews = poems.reduce((sum, poem) => sum + poem.view_count, 0)

    return {
      totalPoems: poems.length,
      totalLikes,
      totalCollections,
      totalViews
    }
  }

  // 热门内容
  static async getTrendingPoems(limit: number = 10): Promise<UserPoem[]> {
    const { data } = await this.getUserPoems({
      limit,
      includeProfile: true
    })

    // 按热度排序（点赞数 + 收藏数 + 评论数）
    return data.sort((a, b) => {
      const scoreA = a.like_count + a.collection_count + a.comment_count
      const scoreB = b.like_count + b.collection_count + b.comment_count
      return scoreB - scoreA
    })
  }

  // 推荐用户
  static async getRecommendedUsers(currentUserId: string, limit: number = 5): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('id', currentUserId)
      .order('total_likes', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('获取推荐用户失败:', error)
      return []
    }

    return data || []
  }
}
