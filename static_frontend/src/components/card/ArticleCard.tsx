import React from 'react';
import Border from '../border/Border';

interface ArticleCardProps {
  imageUrl: string;
  title: string;
  pubDate: string;
  link: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ imageUrl, title, link, pubDate }) => {
    return (
        <Border>
        <a href={link} className="block text-current no-underline">
          <div className=''>
            <img 
              className="h-64 w-full object-cover rounded-t-lg" 
              src={imageUrl} 
              alt={title} 
            />
            <div className='p-5'>
              <h4 className="font-semibold font-syncopate">{title}</h4>
              <div className='w-10 h-1 my-3 rounded-full bg-pink-3'></div>
              <p className="text-xs">{pubDate}</p>
              <div className='py-5'>
              </div>
            </div>
          </div>
      </a>
    </Border>
    );
  }
  

export default ArticleCard;
