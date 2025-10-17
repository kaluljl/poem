// Supabase 客户端初始化（Vite 环境变量）
// 将你的 URL 和 ANON KEY 放到 .env.local：
// VITE_SUPABASE_URL="https://xxxxx.supabase.co"
// VITE_SUPABASE_ANON_KEY="xxxxxx"
import { createClient } from '@supabase/supabase-js'

const hasEnv = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

function createMockClient() {
  // 极简 Mock，覆盖项目中用到的方法，避免导入阶段抛错
  const ok = (data: any = null) => Promise.resolve({ data, error: null, count: data?.length ?? 0 })
  const table = () => {
    const chain = {
      select: (_sel?: any, _opts?: any) => chain,
      order: (_c?: any, _o?: any) => chain,
      eq: (_c?: any, _v?: any) => chain,
      or: (_s?: any) => chain,
      limit: (_n?: number) => chain,
      range: (_from?: number, _to?: number) => chain,
      single: () => ok(null),
      insert: (_v?: any) => ok(null),
      update: (_v?: any) => ok(null),
      delete: () => ok(null)
    }
    // 终止调用返回空集合
    return new Proxy(chain, {
      get(target, prop) {
        if (prop === 'then') {
          // 被当成 Promise 时返回空结果
          return undefined
        }
        if (prop in target) return (target as any)[prop]
        return target[prop as any]
      }
    })
  }

  const mock = {
    __isMock: true,
    from: (_name: string) => table(),
    rpc: (_fn: string, _args?: any) => ok(null),
    auth: {
      getSession: () => ok({ session: null }),
      onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe() {} } }, error: null }),
      signUp: (_: any) => ok({ user: null, session: null }),
      signInWithPassword: (_: any) => ok({ user: null, session: null }),
      signInWithOAuth: (_: any) => ok({ url: '' }),
      signOut: () => ok(null),
      resetPasswordForEmail: (_: any) => ok(null),
      updateUser: (_: any) => ok(null)
    },
    storage: {
      from: (_: string) => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: (_: string) => ({ data: { publicUrl: '' } })
      })
    }
  }
  return mock as any
}

const supabaseReal = hasEnv
  ? createClient(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string
    )
  : createMockClient()

if (!hasEnv) {
  console.warn('[Supabase] 未检测到 VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY，已启用安全的本地 Mock（仅用于开发预览）。')
  console.warn('[Supabase] 若需连接真实后端，请在 .env.local 配置凭据。')
}

export const supabase = supabaseReal