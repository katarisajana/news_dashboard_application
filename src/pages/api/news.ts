// /pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export interface Article {
  author: string;
  title: string;
  type: string;
  publishedAt: string;
  description?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        pageSize: 100,
        apiKey: process.env.NEWS_API_KEY as string, // Make sure to add the key to your environment variables
      },
    });

    // Filter and map the articles as per your interface
    const filteredArticles = response.data.articles.filter((article: Article) => article.title && article.title !== "[Removed]");

    const articles = filteredArticles.map((article: Article) => ({
      author: article.author || "Unknown",
      title: article.title || "Untitled",
      type: article.type || "news",
      publishedAt: article.publishedAt || new Date().toISOString(),
      description: article.description || "",
    }));

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export default handler;
