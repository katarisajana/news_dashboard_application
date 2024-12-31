import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { Article } from "@/api/news";

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

interface ChartsProps {
  articles: Article[];
}

export default function Charts({ articles }: ChartsProps) {
  const authors = articles.reduce((acc: Record<string, number>, article) => {
    acc[article.author] = (acc[article.author] || 0) + 1;
    return acc;
  }, {});

  const types = articles.reduce((acc: Record<string, number>, article) => {
    acc[article.type] = (acc[article.type] || 0) + 1;
    return acc;
  }, {});

  const authorData = {
    labels: Object.keys(authors).map((author) => 
        author.length > 15 ? author.substring(0, 15) + "..." : author
      ),
    datasets: [
      {
        label: "Articles by Author",
        data: Object.values(authors),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9F40"],
      },
    ],
  };

  const typeData = {
    labels: Object.keys(types),
    datasets: [
      {
        label: "Articles by Type",
        data: Object.values(types),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9F40"],
      },
    ],
  };

  return (
    <div className="p-4 grid grid-cols-[65%,35%] gap-4">
      <div className="border rounded p-4 shadow h-[500px]">
        <h2 className="text-lg font-bold mb-4">Article Trends by Author</h2>
        <div className="h-[400px] w-full">
        <Bar data={authorData} />
        </div>
      </div>
      <div className="border rounded p-4 shadow h-[500px]">
        <h2 className="text-lg font-bold mb-4">Article Trends by Type</h2>
        <div className="h-[400px]">
        <Pie data={typeData} />
        </div>
      </div>
    </div>
  );
}
