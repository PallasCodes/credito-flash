export function createQueryParams(
  payload: any,
  resultcode: boolean = false,
): string {
  const queryParams: string[] = []

  for (const key in payload) {
    if (typeof payload[key] === 'string') {
      queryParams.push(`@${key} = '${payload[key]}'`)
    } else {
      queryParams.push(`@${key} = ${payload[key]}`)
    }
  }

  if (resultcode) {
    queryParams.push('@resultcode = @resultcode OUTPUT')
  }

  return queryParams.join(', ')
}
