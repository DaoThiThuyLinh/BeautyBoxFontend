import formatParams from './formatParams'

export default function pushParams(params: Record<string, any>) {
  const _params = formatParams(params)
  const url = Object.keys(_params)
    .map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(_params[key])
    })
    .join('&')
  history.pushState(null, '', `${location.pathname}?${url}`)
}
