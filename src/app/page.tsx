import Link from "next/link"

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-extrabold grid self-center justify-center">
        This is the homepage.
      </h1>
      <Link href="/blog" className="link">Blog</Link>
      <Link href="/products" className="link">Product</Link>
      <Link href="/articles/breaking-new-123?lang=en" className="link">Read in English</Link>
      <Link href="/articles/breaking-new-123?lang=fr" className="link">Read in French</Link>
    </>
  )
}