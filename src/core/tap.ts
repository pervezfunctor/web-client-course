export const tap = <T>(arg: T): T => {
  console.log(JSON.stringify(arg, null, 2))
  return arg
}
