import React from 'react';

interface ArticleCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ imageUrl, title, description }) => {
  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <img className="h-32 w-32 rounded-lg" src={imageUrl} alt={title} />
      <div>
        <div className="text-xl font-medium text-black">{title}</div>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default ArticleCard;
