import { cloneDeep, forEach } from 'lodash-es'

/**
 * Formats the parameters object by performing the following operations:
 * - Converts specified date fields to UTC time format.
 * - Trims the 'search' field.
 * - Removes empty values from the object.
 *
 * @param params - The parameters object to be formatted.
 * @returns The formatted parameters object.
 */
export default function formatParams(params: Record<string, any>) {
  if (params) {
    const _params = cloneDeep(params)
    const keys = Object.keys(_params)
    forEach(keys, key => {
      // trim search
      if (key === 'search') {
        _params[key] = _params[key].trim()
      }
      // remove empty value
      if (!_params[key] || _params[key] === 'undefined') {
        delete _params[key]
      }

      // remove key loading
      if (key === 'loading') {
        delete _params[key]
      }
    })
    return _params
  }
  return params
}
