import {client} from '@/sanity/client'
import styles from './page.module.css'

type Post = {
  _id: string
  title: string
  body: string
}

export const revalidate = 0

export default async function Home() {
  const posts = await client.fetch<Post[]>(
    `*[_type == "post"] | order(_createdAt desc){_id, title, body}`,
  )

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Daniels hjemmeside
        </h1>
        {posts.length === 0 ? (
          <p>
            No content yet. Add a &quot;Post&quot; in the{' '}
            <a href="http://localhost:3333" target="_blank" rel="noopener noreferrer">
              Sanity Studio
            </a>{' '}
            and it will show up here.
          </p>
        ) : (
          posts.map((post) => (
            <article key={post._id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </article>
          ))
        )}
      </main>
    </div>
  )
}
