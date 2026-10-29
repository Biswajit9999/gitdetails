import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmed = username.trim();

    // clear previous results/errors before every search
    setUser(null);
    setError("");

    if (!trimmed) {
      setError("Please enter a GitHub username.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(trimmed)}`
      );

      if (response.status === 404) {
        setError("User not found.");
        return;
      }
      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const blogHref =
    user && user.blog
      ? user.blog.startsWith("http")
        ? user.blog
        : `https://${user.blog}`
      : "";

  return (
    <div className="page">
      <div className="card">
        <h1>GitHub User Finder</h1>
        <p className="subtitle">Search a GitHub username to see profile details.</p>

        <form className="search" onSubmit={handleSearch}>
          <input
            type="text"
            name="username"
            placeholder="e.g. torvalds, gaearon, octocat"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            Search
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {!user && !error && !loading && (
          <p className="empty">No user yet. Try searching for 'octocat'.</p>
        )}

        {user && (
          <div className="profile">
            <img src={user.avatar_url} alt={user.login} className="avatar" />

            <div className="info">
              <h2>
                {user.name || user.login}
                <span className="login">@{user.login}</span>
              </h2>

              <div className="stats">
                <span className="stat">
                  <strong>{user.public_repos}</strong> Repos
                </span>
                <span className="stat">
                  <strong>{user.followers}</strong> Followers
                </span>
                <span className="stat">
                  <strong>{user.following}</strong> Following
                </span>
              </div>

              <div className="meta">
                {user.location && <span>📍 {user.location}</span>}
                {user.company && <span>🏢 {user.company}</span>}
                {blogHref && (
                  <span>
                    🔗{" "}
                    <a href={blogHref} target="_blank" rel="noreferrer">
                      {user.blog}
                    </a>
                  </span>
                )}
                <span>
                  🐙{" "}
                  <a href={user.html_url} target="_blank" rel="noreferrer">
                    View on GitHub
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;