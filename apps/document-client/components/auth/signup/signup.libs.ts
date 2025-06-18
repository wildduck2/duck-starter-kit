import axios from 'axios'
import { libResponse } from '~/libs/libResponse'
import { User } from '~/server/auth/schema/user.schema'
import { ResponseType } from '~/server/common/types'
import { SignupSchemaType } from './signup.dto'

export async function handleSignup(_data: SignupSchemaType): Promise<ResponseType<Omit<User, 'password'>>> {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + '/auth/signup',
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

export async function handleSignupWithGithub(): Promise<void> {}
