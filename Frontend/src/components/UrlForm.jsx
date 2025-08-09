import React, { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";

const UrlForm = () => {
  const [url, setUrl] = useState("https://example.com");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setCopied(false);
    try {
      const shortUrlResponse = await createShortUrl(url);
      setShortUrl(shortUrlResponse);
    } catch (err) {
      setError("Could not shorten URL. Try again.");
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto flex flex-col gap-4 sm:gap-5 md:gap-6"
    >
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste your URL"
        required
        className="p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full text-base"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition w-full"
      >
        Shorten URL
      </button>
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-center text-sm w-full">
          {error}
        </div>
      )}
      {shortUrl && (
        <div className="mt-2 p-4 bg-green-100 rounded-lg flex flex-col sm:flex-row items-center justify-between w-full gap-2 sm:gap-4">
          <a
            href={shortUrl}
            className="text-blue-700 underline break-all text-center sm:text-left w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-1 rounded transition text-sm w-full sm:w-auto
              ${
                copied
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }
            `}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </form>
  );
};

export default UrlForm;
