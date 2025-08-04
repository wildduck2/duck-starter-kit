import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookie = await cookies().then((res) => res.get('connect.sid'))
  if (!cookie) {
    return redirect('/auth/signin')
  }
  return <>{children}</>
}
