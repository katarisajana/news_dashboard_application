"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Hook to get session data
import { useRouter } from "next/navigation"; // Hook to navigate between pages
import { fetchArticles, Article } from "@/api/news";
import Filters from "@/components/filters";
import Charts from "@/components/charts";
import NewsFeed from "@/components/newsfeed";
import Login from "@/app/login/page";
import PayoutCalculator from "@/components/payoutcalculator";
import Export from "@/components/export"

export default function Dashboard() {
  const { data: session, status } = useSession(); // Session data and status
  const router = useRouter(); // Router for navigation
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // UseEffect to redirect user to login if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while loading session
    console.log(localStorage.getItem("isAuthenticated"))
    if (!session && (localStorage.getItem("isAuthenticated")=="False" || localStorage.getItem("isAuthenticated")==null)) {
      // If no session, redirect to login page
      router.push("/login");
    } else {
      // Fetch articles if user is authenticated
      fetchArticles().then((data) => {
        setArticles(data);
        setFilteredArticles(data);
      });
    }
  }, [session, status, router]);

  if (status === "loading") {
    // While session is loading, show loading state
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" bg-white">
        <Login />
      </div>
      <Filters articles={articles} setFilteredArticles={setFilteredArticles} />
      <Charts articles={filteredArticles} />
      <NewsFeed articles={filteredArticles} />
      <PayoutCalculator articles={filteredArticles} />
      <Export articles={filteredArticles} />
    </div>
  );
}

