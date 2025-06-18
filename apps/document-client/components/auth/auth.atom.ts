'use client'
import { atom } from 'jotai'
import { User } from '~/server/auth/schema/user.schema'
export const userAtom = atom<Omit<User, 'password'>>(
  (JSON.parse(localStorage?.getItem('user') as string) || null) as Omit<User, 'password'>,
)
