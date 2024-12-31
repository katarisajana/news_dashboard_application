"use client"
// import React, { useState, useEffect } from "react";
// import { Article } from "@/api/news";

// interface PayoutCalculatorProps {
//   articles: Article[];
// }

// const PayoutCalculator: React.FC<PayoutCalculatorProps> = ({ articles }) => {
//   const [payoutRate, setPayoutRate] = useState<number>(() => {
//     const savedRate = localStorage.getItem("payoutRate");
//     return savedRate ? parseFloat(savedRate) : 0;
//   });

//   const totalPayout = articles.length * payoutRate;

//   useEffect(() => {
//     localStorage.setItem("payoutRate", payoutRate.toString());
//   }, [payoutRate]);

//   return (
//     <div className="p-4 border rounded shadow">
//       <h2 className="text-lg font-bold mb-4">Payout Calculator</h2>
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center gap-2">
//           <label htmlFor="payoutRate" className="text-sm font-medium">
//             Payout per Article:
//           </label>
//           <input
//             id="payoutRate"
//             type="number"
//             value={payoutRate}
//             onChange={(e) => setPayoutRate(parseFloat(e.target.value) || 0)}
//             className="border rounded p-2 w-32"
//             placeholder="Enter rate"
//           />
//         </div>
//         <p className="text-sm">
//           <strong>Total Articles:</strong> {articles.length}
//         </p>
//         <p className="text-sm">
//           <strong>Total Payout:</strong> ${totalPayout.toFixed(2)}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PayoutCalculator;


import React, { useState, useEffect } from "react";
import { Article } from "@/api/news";

interface PayoutCalculatorProps {
  articles: Article[];
}

const PayoutCalculator: React.FC<PayoutCalculatorProps> = ({ articles }) => {
  const [payouts, setPayouts] = useState<Record<string, number>>(() => {
    const savedPayouts = localStorage.getItem("payouts");
    return savedPayouts ? JSON.parse(savedPayouts) : {};
  });

  const [totalPayout, setTotalPayout] = useState<number>(0);

  // Calculate the total payout whenever payouts or articles change
  useEffect(() => {
    const total = articles.reduce((sum, article) => {
      const articlePayout = payouts[article.title] || 10;
      return sum + articlePayout;
    }, 0);
    setTotalPayout(total);
  }, [articles, payouts]);

  // Save payouts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("payouts", JSON.stringify(payouts));
  }, [payouts]);

  // Handle payout rate change for a specific article
  const handlePayoutChange = (title: string, rate: number) => {
    if (localStorage.getItem("isAdmin")!="True") return;
    setPayouts((prev) => ({
      ...prev,
      [title]: rate,
    }));
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Payout Calculator</h2>
      <div className="flex flex-col gap-4">
        {/* Article List with Individual Payouts */}
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <div
              key={article.title}
              className="flex items-center justify-between border-b pb-2"
            >
              <p className="text-sm font-medium">{article.title}</p>
              <div className="flex items-center gap-2">
                <label htmlFor={`payout-${article.title}`} className="text-sm">
                  Payout:
                </label>
                <input
                  id={`payout-${article.title}`}
                  type="number"
                  value={payouts[article.title] || 10}
                  onChange={(e) =>
                    handlePayoutChange(
                      article.title,
                      parseFloat(e.target.value) || 10
                    )
                  }
                  className="border rounded p-1 w-20 text-sm"
                  placeholder="Rate"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total Payout */}
        <p className="text-sm font-bold">
          Total Payout: <span className="text-green-600">${totalPayout.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default PayoutCalculator;

