export const isEmptyArray = (arr: any): boolean => (
  Array.isArray(arr) && arr.length === 0
)

export const isNonEmptyArray = (arr: any): boolean => (
  Array.isArray(arr) && arr.length > 0
)