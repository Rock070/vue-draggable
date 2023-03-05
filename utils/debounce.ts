import isNullOrUndefined from './isNullOrUndefined'

export default <T extends (...args: any[]) => any>(
  callback: T,
  limit = 33.34,
) => {
  let timer: ReturnType<typeof setTimeout> | null

  return ((...args) => {
    if (!isNullOrUndefined(timer))
      clearTimeout(timer)
    timer = setTimeout(() => callback(...args), limit)
  }) as T
}
