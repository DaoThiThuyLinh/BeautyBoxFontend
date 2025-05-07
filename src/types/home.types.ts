export interface RsBlog {
  count: number
  data: IBlog[]
  page: number
  pageCount: number
  total: number
}

export interface IBlog {
  id: string
  image: string
  data: BlogData
  author: string
  title: string | null
  slug: string
  content: string | null
  status: string
  publishingDate: string // ISO date string
  authorId: string
  graphData: GraphData | null
  shortContent: string | null
}

export type BlogDetail = {
  title: string
  content: string
  langCode: string
  shortContent: string
}

export type GraphData = {
  title: string
  keywords: string
  description: string
}

export type BlogData = {
  detail: BlogDetail[]
  prefix: string
  products: string[]
  graphData: GraphData
  categoryIds: string[]
  mobileImage: string
}

export type Blog = {
  id: string
  image: string
  data: BlogData
  author: string
  title: string | null
  slug: string
  content: string | null
  status: string
  publishingDate: string // ISO date string
  authorId: string
  graphData: GraphData | null
  shortContent: string | null
}
