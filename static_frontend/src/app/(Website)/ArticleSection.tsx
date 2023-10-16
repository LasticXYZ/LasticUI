import Head from 'next/head'
import ArticleCard from '@/components/card/ArticleCard'

export default function Home() {
  return (
    <div className="bg-pink-100 p-12">
      <h2 className="text-4xl font-bold mb-8 text-center">ARTICLES</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Repeat this component as many times as required */}
        <ArticleCard 
          imageUrl="/path_to_your_image.jpg" 
          title="WHAT IS a BLOCKSPACE marketplace?" 
          description="solfka dfkalsdfm sdkfas ofpsdm skdm osdfijsdfjosjfdsoif"
        />
        {/* ... */}
      </div>
    </div>
  )
}
