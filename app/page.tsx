'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
export default function Home() {
  return (
    <>
    <div className='container'>
        <h1>Hello home page</h1>
        <Link href="/categories">Link</Link>
    </div>
    </>
  )
}
