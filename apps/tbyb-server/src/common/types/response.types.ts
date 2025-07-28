export type ResponseType<TData extends unknown, TMessage extends readonly string[] = any> =
  | {
      state: 'error'
      message: TMessage[number]
    }
  | {
      data: TData
      state: 'success'
      message: TMessage[number]
    }

export type getAPI<T> = {
  [K in keyof T]: T[K]
}
