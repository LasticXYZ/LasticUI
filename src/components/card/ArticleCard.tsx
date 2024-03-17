import React from 'react'
import Border from '../border/Border'

interface ArticleCardProps {
  imageUrl: string
  title: string
  pubDate: string
  author: string
  link: string
}

function parseDateTime(dateTimeString: string): { date: string; time: string } {
  const dateObject = new Date(dateTimeString)

  // Format the date and time to your needs, here I'm using ISO format
  const date = dateObject.toISOString().split('T')[0] // gets the date part
  const time = dateObject.toTimeString().split(' ')[0] // gets the time part

  return { date, time }
}

const ArticleCard: React.FC<ArticleCardProps> = ({ imageUrl, title, link, pubDate, author }) => {
  let { date, time } = parseDateTime(pubDate)
  console.log(imageUrl)

  return (
    <Border>
      <a href={link} className="block text-current no-underline">
        <div className="">
          <img className="h-64 w-full object-cover rounded-t-lg" src={imageUrl} alt={title}></img>
          <div className="p-5">
            <h4 className="font-semibold font-unbounded uppercase">{title}</h4>
            <div className="w-10 h-1 my-3 rounded-full bg-pink-3"></div>
            <p className="text-xs py-1">Written by: {author}</p>
            <p className="text-xs py-1">Date: {date}</p>
            <div className="py-5"></div>
          </div>
        </div>
      </a>
    </Border>
  )
}

export default ArticleCard
