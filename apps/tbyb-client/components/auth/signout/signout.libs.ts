import axios from 'axios'
import { libResponse } from '~/libs/libResponse'
import { ResponseType } from '~/server/common/types'

export async function handleSignout(): Promise<ResponseType<null>> {
  try {
    const { data } = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/signout', {
      withCredentials: true,
    })

    return data
  } catch (error) {
    return libResponse(error)
  }
}
