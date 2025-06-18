import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { libResponse } from '~/libs/libResponse'
import { SigninSchemaType } from '~/server/auth/auth.types'
import { User } from '~/server/auth/schema/user.schema'
import { ResponseType } from '~/server/common/types'

export async function handleSignin(_data: SigninSchemaType): Promise<ResponseType<Omit<User, 'password'>>> {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + '/auth/signin',
      {
        ..._data,
      },
      {
        withCredentials: true,
      },
    )

    return data
  } catch (error) {
    return libResponse(error)
  }
}

export async function handleSigninWithGithub(): Promise<void> {}
