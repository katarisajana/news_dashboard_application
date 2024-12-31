import axios from "axios";

export interface Article {
  author: string; // Author can be null if missing
  title: string;
  type: string; // 'news' or 'blog'
  publishedAt: string; // ISO date string
  description?: string; // Optional property
}

export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        pageSize: 100, 
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
      },
    });

    const filteredArticles = response.data.articles.filter(
      (article: Article) => article.title && article.title !== "[Removed]"
    );

    // Map API response to match the Article interface
    return filteredArticles.map((article: Article) => ({
      author: article.author || "Unknown",
      title: article.title || "Untitled",
      type: article.type || "news",
      publishedAt: article.publishedAt || new Date().toISOString(),
      description: article.description || "",
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};
