import React from 'react'
import Link from 'next/link'

const HomePAge = () => {
  return (
    <div>
      <h1 className="text-3xl">
        Welcome
      </h1>
      <Link href="/properties" className="">Show Properties</Link>
    </div>
  )
}

export default HomePAge
