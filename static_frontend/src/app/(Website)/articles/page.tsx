"use client";

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/card/ArticleCard';

interface Article {
    title: string;
    thumbnail: string;
    pubDate: string;
    link: string;
  }


export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/lastic-marketplace', { cache: 'no-store' });
      const data = await res.json();

      // Ensure the data you're working with is in the format you expect.
      // If the articles are stored under a different key, adjust as needed.
      if (data && data.items) {
        setArticles(data.items);
      }
    }

    fetchArticles();
  }, []);

  return (
    <div className="bg-pink-100 p-12">
      <h2 className="text-4xl font-bold mb-8 font-syncopate text-center">ARTICLES</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            imageUrl={article.thumbnail}  // Adjust these properties based on the structure of the RSS feed data
            title={article.title}
            pubDate={article.pubDate}
            link={article.link}
          />
        ))}
      </div>
    </div>
  );
}
