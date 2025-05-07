import formatNumber from './formatNumber'

export default function formatAbbreviateNumber(numberString: string | number, numberCompare = 1 * 10 ** 3) {
  if (!numberString) return '0'

  const number = Number(numberString)
  if (number < numberCompare) return formatNumber(number)

  const SI_SYMBOL = ['', 'K', 'M', 'B', 'T', 'P', 'E']

  const tier = Math.floor(Math.log10(Math.abs(number)) / 3)
  if (tier === 0) return formatNumber(number)

  const suffix = SI_SYMBOL[tier]
  const scale = Math.pow(10, tier * 3)
  const scaledNumber = number / scale

  // Format phần nguyên + thập phân, có dấu phẩy
  const [intPart, decimalPart] = scaledNumber.toFixed(2).split('.')
  const formattedInt = formatNumber(intPart)

  return decimalPart === '00' ? `${formattedInt}${suffix}` : `${formattedInt}.${decimalPart}${suffix}`
}
