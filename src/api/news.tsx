import axios from "axios";

export interface Article {
  author: string;
  title: string;
  type: string;
  publishedAt: string;
  description?: string;
}

export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await axios.get("/api/news"); // Call the proxy API route

    // Assuming the response data has the same structure as before
    const filteredArticles = response.data.filter(
      (article: Article) => article.title && article.title !== "[Removed]"
    );

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
