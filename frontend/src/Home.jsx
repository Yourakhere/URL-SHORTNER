import React, { useState, useEffect } from "react";
import "./App.css";
//https://akurl.vercel.app/
//https://url-shortner-le4b.onrender.com


function Home() {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState("");
  const [error, setError] = useState("");
  const [totalVisits, setTotalVisits] = useState(0);
  const [localLinks, setLocalLinks] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("https://akurl.vercel.app/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortId(data.id);
        const newLink = { id: data.id, originalUrl: url, visits: 0 };
        const storedLinks = JSON.parse(localStorage.getItem("shortLinks")) || [];
        storedLinks.push(newLink);
        localStorage.setItem("shortLinks", JSON.stringify(storedLinks));
        setLocalLinks(storedLinks);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to connect to server");
    }
  };

  const handleVisit = (id) => {
    const storedLinks = JSON.parse(localStorage.getItem("shortLinks")) || [];
    const updatedLinks = storedLinks.map((link) => {
      if (link.id === id) {
        return { ...link, visits: link.visits + 1 };
      }
      return link;
    });
    localStorage.setItem("shortLinks", JSON.stringify(updatedLinks));
    setLocalLinks(updatedLinks);
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  useEffect(() => {
    const fetchTotalVisits = async () => {
      try {
        const res = await fetch("https://akurl.vercel.app/url/total-visits");
        const data = await res.json();
        setTotalVisits(data.total);
      } catch {}
    };
    fetchTotalVisits();
    const storedLinks = JSON.parse(localStorage.getItem("shortLinks")) || [];
    setLocalLinks(storedLinks);
  }, []);

  return (
    <div className="App">
      <div className="box">
        <h1>URL Shortener</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a long URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit">Shorten</button>
        </form>

        {shortId && (
          <p>
            Short URL:{" "}
            <a
              href={`https://akurl.vercel.app/${shortId}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleVisit(shortId)}
            >
              https://url-shortner-le4b.onrender.com/{shortId}
            </a>
            <span
              className="copy-icon"
              onClick={() =>
                handleCopy(`https://akurl.vercel.app/${shortId}`)
              }
            >
              📋
            </span>
          </p>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>Total Visits (Server): {totalVisits}</p>

        <h2>Your Shortened Links (Local)</h2>
        <ul>
          {localLinks.map((link, index) => (
            <li key={index}>
              <a
                href={`https://akurl.vercel.app/${link.id}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleVisit(link.id)}
              >
                {link.originalUrl} ➜ {link.id}
              </a>
              <span
                className="copy-icon"
                onClick={() =>
                  handleCopy(`https://akurl.vercel.app/${link.id}`)
                }
              >
                📋
              </span>{" "}
              | Visits: {link.visits}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;

