export type Poem = {
  id: string
  title: string
  author: string
  dynasty: string
  lines: string[]
  tags: string[]
  text: string
}

// 从 public/poems.json 拉取数据
export async function fetchPoems(): Promise<Poem[]> {
  const res = await fetch('/poems.json')
  if (!res.ok) throw new Error(`加载诗词数据失败：${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data as Poem[] : []
}

// 在给定数据集上执行检索
export function searchPoems(dataset: Poem[], query: string, options?: { dynasty?: string; tag?: string }) {
  const q = (query || '').trim().toLowerCase()
  return dataset.filter(p => {
    const matchText =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.text.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    const matchDynasty = options?.dynasty ? p.dynasty.includes(options.dynasty) : true
    const matchTag = options?.tag ? p.tags.some(t => t.includes(options.tag!)) : true
    return matchText && matchDynasty && matchTag
  })
}