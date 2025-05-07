import type { IQuery } from '@/types/component.types'

export default function printIndex(index: number, query: IQuery): number {
  return (query.pageIndex - 1) * query.pageSize + index + 1
}
