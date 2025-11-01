import type { MatchQuery } from './interface/general'

export const toCamel = (s: string): string => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}

export const toSnake = (s: string): string => {
  return s.replace(/(?:^|\.?)([A-Z])/g, (x, y) => '_' + y.toLowerCase()).replace(/^_/, '')
}

export const convertMatchQueryToPCQuery = (query: MatchQuery): object => {
  const outQuery = {}
  for (const key of Object.keys(query)) {
    const newKey = toSnake(key)
    if (query[key] instanceof Date) {
      outQuery[newKey] =
        `${query[key].getDate().toString().padStart(2, '0')}/${query[key].getMonth().toString().padStart(2, '0')}/${query[key].getFullYear()}`
    } else {
      outQuery[newKey] = query[key]
    }
  }
  return outQuery
}
