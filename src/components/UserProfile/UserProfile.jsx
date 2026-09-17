import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { allPosts } from '../../api/getAllPosts.api'
import Loader from '../Loader/Loader'
import Error from '../Error/Error'
import CardPost from '../CardPost/CardPost'

export default function UserProfile() {
  const { username } = useParams()
  const { data: posts = [], isLoading, isError, error } = useQuery({
    queryKey: ['allPosts'],
    queryFn: allPosts,
    select: (response) => response?.data?.data?.posts ?? [],
  })

  if (isLoading) return <Loader />
  if (isError) return <Error error={error?.message} />

  const userPosts = posts.filter((post) => post.user?.username === username)
  const user = userPosts[0]?.user

  if (!user) {
    return <Error error="User profile not found" />
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-12 text-slate-900">
      <div className="mx-auto max-w-5xl px-4">
        <section className="mb-5 bg-white p-6 shadow-sm sm:rounded-xl">
          <div className="flex items-center gap-4">
            <img className="h-20 w-20 rounded-full object-cover" src={user.photo} alt={user.name} />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-slate-500">@{user.username}</p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          {userPosts.map((post) => <CardPost key={post.id} post={post} />)}
        </section>
      </div>
    </main>
  )
}
