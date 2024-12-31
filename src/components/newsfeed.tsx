import React from "react";
import { Article } from "@/api/news";

interface NewsFeedProps {
  articles: Article[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">News Feed</h2>
      {articles.length === 0 ? (
        <p className="text-gray-500">No articles available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <div
              key={index}
              className="border rounded p-4 shadow hover:shadow-md transition"
            >
              <h3 className="text-md font-semibold">{article.title}</h3>
              <p className="text-sm text-gray-600">By: {article.author || "Unknown"}</p>
              <p className="text-sm text-gray-600">
                Published: {new Date(article.publishedAt).toLocaleDateString()}
              </p>
              <p className="text-sm mt-2">{article.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
