// app/properties/[id]/loading.jsx
import React from 'react'
import Spinner from '@/components/Spinner'

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <Spinner loading={true} />
    </div>
  )
}

export default Loading