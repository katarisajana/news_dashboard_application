import { useState } from "react";
import { Article } from "@/api/news";

interface FiltersProps {
  articles: Article[];
  setFilteredArticles: (articles: Article[]) => void;
}

export default function Filters({ articles, setFilteredArticles }: FiltersProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [type, setType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });

  const filterArticles = () => {
    let filtered = articles;

    if (globalSearch) {
      filtered = filtered.filter((article) =>
        Object.values(article)
          .join(" ")
          .toLowerCase()
          .includes(globalSearch.toLowerCase())
      );
    }

    if (type !== "all") {
      filtered = filtered.filter((article) => article.type?.toLowerCase() === type.toLowerCase());
    }

    if (searchTerm) {
      filtered = filtered.filter((article) =>
        article.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter((article) => {
        console.log(startDate)
        console.log(endDate)
        const publishedDate = new Date(article.publishedAt);
        return publishedDate >= startDate && publishedDate <= endDate;
      });
    }

    setFilteredArticles(filtered);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setGlobalSearch("");
    setType("all");
    setDateRange({ start: "", end: "" });
    setFilteredArticles(articles);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <input
        type="text"
        className="border rounded p-2 w-full md:w-1/3"
        placeholder="Global Search (e.g., title, author, type)"
        value={globalSearch}
        onChange={(e) => setGlobalSearch(e.target.value)}
      />
      <input
        type="text"
        className="border rounded p-2 w-full md:w-1/3"
        placeholder="Search by Author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="border rounded p-2 w-full md:w-1/6"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="news">News</option>
        <option value="blog">Blog</option>
      </select>
      <div className="flex gap-2 w-full md:w-1/2">
        <input
          type="date"
          className="border rounded p-2 w-1/2"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
        <input
          type="date"
          className="border rounded p-2 w-1/2"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={filterArticles}
        >
          Apply Filters
        </button>
        <button
          className="bg-gray-500 text-white p-2 rounded"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
