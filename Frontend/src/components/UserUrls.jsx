import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";

const UserUrls = () => {
  const [copiedId, setCopiedId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 3000,
    staleTime: 0,
  });

  const urls = data?.urls || [];

  console.log("user data", urls);

  const handleCopy = (id, shortUrl) => {
    const copiedUrl = `http://localhost:5000/${shortUrl}`;
    navigator.clipboard.writeText(copiedUrl);

    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error.message}</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Original URL
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Short URL
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
              Clicks
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {urls
            .slice()
            .reverse()
            .map((url) => (
              <tr key={url._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800 truncate max-w-xs">
                  {url.fullUrl}
                </td>
                <td className="px-4 py-3 text-sm text-blue-600">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.shortUrl}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-600">
                  {url.clicks}
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    onClick={() => handleCopy(url._id, url.shortUrl)}
                    className={`px-3 py-1 rounded text-sm transition ${
                      copiedId === url._id
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {copiedId === url._id ? "Copied!" : "Copy"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {urls.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No URLs found. Create your first shortened URL!
        </div>
      )}
    </div>
  );
};

export default UserUrls;
