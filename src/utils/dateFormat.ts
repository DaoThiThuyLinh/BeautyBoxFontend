import { useDateFormat } from '@vueuse/core'

export default function dateFormat(date: string | Date | number, formatStr: string): string {
  if (date && formatStr) {
    return useDateFormat(date, formatStr).value
  }
  return ''
}
