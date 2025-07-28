const addr = {
  a: 1,
  b: 2,
  c: undefined,
}

export function foo(obj: any) {
  return { ...obj }
}

type User = {
  id: string
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

console.log(foo(addr))
