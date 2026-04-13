import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  searchAiResources,
  getCachedResults,
  type AiResourceItem,
} from "@/services/aiPath";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "learnsmart_recent_searches_v1";
const MAX_RECENT = 8;

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(topics: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics.slice(0, MAX_RECENT)));
  } catch {}
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function resourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "resource";
  }
}

function resourceTypeLabel(type: string) {
  const map: Record<string, string> = {
    video: "video",
    article: "article",
    course: "course",
    docs: "docs",
    repo: "repo",
    other: "resource",
  };
  return map[type] ?? "resource";
}

function resourceTypeColor(type: string) {
  const map: Record<string, string> = {
    video: "#ef4444",
    article: "#3b82f6",
    course: "#8b5cf6",
    docs: "#22c55e",
    repo: "#f59e0b",
    other: "#6b7280",
  };
  return map[type] ?? "#6b7280";
}

function difficultyLabel(d: string) {
  const map: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  return map[d] ?? d;
}

const GITHUB_FALLBACK =
  "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";

function getThumbnail(item: AiResourceItem): string {
  if (item.image) return item.image;
  if (item.url.includes("github.com")) return GITHUB_FALLBACK;
  return "";
}

// ── ResourceCard ─────────────────────────────────────────────────────────────

function ResourceCard({ item }: { item: AiResourceItem }) {
  const thumb = getThumbnail(item);
  const isGithub = item.url.includes("github.com");

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-md border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:border-stone-300 hover:shadow-md"
    >
      {thumb && (
        <div
          className="relative w-full overflow-hidden bg-stone-100"
          style={{ aspectRatio: "16/9" }}
        >
          <img
            src={thumb}
            alt={item.title}
            className={`w-full h-full object-cover ${isGithub ? "object-center" : "object-top"}`}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {item.resource_type === "repo" && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5">
              <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="text-[10px] font-semibold text-white">GitHub</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-stone-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${resourceTypeColor(item.resource_type)}15`,
              color: resourceTypeColor(item.resource_type),
            }}
          >
            {resourceTypeLabel(item.resource_type)}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
            {resourceHost(item.url)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-stone-400">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{
              backgroundColor:
                item.difficulty === "beginner"
                  ? "#dcfce7"
                  : item.difficulty === "intermediate"
                    ? "#fef9c3"
                    : "#fee2e2",
              color:
                item.difficulty === "beginner"
                  ? "#16a34a"
                  : item.difficulty === "intermediate"
                    ? "#ca8a04"
                    : "#dc2626",
            }}
          >
            {difficultyLabel(item.difficulty)}
          </span>
          <span>·</span>
          <span>{item.estimated_minutes} min</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-bold leading-snug text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-stone-500 line-clamp-3 flex-1">
          {item.description}
        </p>

        {item.key_points.length > 0 && (
          <ul className="space-y-1.5">
            {item.key_points.slice(0, 3).map((point, idx) => (
              <li
                key={idx}
                className="flex gap-2 text-xs leading-5 text-stone-600"
              >
                <span className="mt-1.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span className="line-clamp-1">{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-stone-100 px-5 py-3">
        <span className="text-[11px] font-semibold text-stone-400 group-hover:text-amber-600 transition-colors">
          Open resource →
        </span>
      </div>
    </a>
  );
}

// ── Presets ─────────────────────────────────────────────────────────────────

const presets = [
  "React hooks best practices",
  "Python async programming",
  "Machine learning fundamentals",
  "TypeScript advanced types",
  "openclaw",
  "claude code",
];

// ── Component ────────────────────────────────────────────────────────────────

export default function AIRsource() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AiResourceItem[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCached, setLoadingCached] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isCachedResult, setIsCachedResult] = useState(false);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  // Save a topic to recent searches
  const addRecentSearch = useCallback((t: string) => {
    const trimmed = t.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, MAX_RECENT);
      saveRecentSearches(next);
      return next;
    });
  }, []);

  // Full search — hits backend, caches result
  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setIsCachedResult(false);
    try {
      const resp = await searchAiResources(q);
      setResults(resp.data);
      setTopic(resp.topic);
      setSearched(true);
      addRecentSearch(q);
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      setError(
        String(
          err.response?.data?.detail ||
            err.message ||
            "Search failed"
        )
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, addRecentSearch]);

  // Load from cache — no API call, just DB read
  const handleLoadCached = useCallback(async (t: string) => {
    setLoadingCached(true);
    setError("");
    setIsCachedResult(true);
    setQuery(t);
    try {
      const resp = await getCachedResults(t);
      setResults(resp.data);
      setTopic(resp.topic);
      setSearched(true);
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      setError(
        String(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load cached results"
        )
      );
      setResults([]);
    } finally {
      setLoadingCached(false);
    }
  }, []);

  const removeRecent = useCallback((t: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s !== t);
      saveRecentSearches(next);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-8 bg-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
                  AI Guided
                </span>
              </div>
              <h1 className="text-3xl font-black leading-[0.92] tracking-tight text-stone-900 md:text-5xl">
                AI Resource
                <br />
                <span className="text-amber-500">Search.</span>
              </h1>
            </div>
            <p className="hidden max-w-sm text-sm leading-relaxed text-stone-500 md:block">
              Enter any learning topic and AI will search the web for the most
              relevant tutorials, articles, videos and docs — summarised and
              ready to explore.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Search input */}
        <section className="mb-8 rounded-md border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
              Search
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-stone-900">
              What do you want to learn about?
            </h2>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Kubernetes, React performance, SQL optimization"
              className="flex-1 rounded-sm border border-stone-200 bg-stone-50 px-5 py-3 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50"
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="rounded-sm bg-amber-500 px-6 py-3 text-sm font-bold text-white hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Presets */}
          <div className="mt-4 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setQuery(p)}
                className="rounded-sm border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-stone-500 transition-colors hover:border-amber-200 hover:text-amber-700"
              >
                {p}
              </button>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </section>

        {/* Results */}
        {searched && (
          <section>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
                  {isCachedResult ? "Cached" : "Results"}
                </p>
                <h3 className="mt-1 text-lg font-black tracking-tight text-stone-900">
                  {topic}
                  <span className="ml-2 text-sm font-medium text-stone-400">
                    — {results.length} resources found
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-4">
                {isCachedResult && (
                  <span className="flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-[10px] font-semibold text-stone-500">
                    from cache
                  </span>
                )}
                <Link
                  to="/ai-path"
                  className="text-xs font-semibold uppercase tracking-wider text-stone-400 transition-colors hover:text-amber-500"
                >
                  Or generate a full path →
                </Link>
              </div>
            </div>

            {results.length === 0 && !loading && !loadingCached && (
              <div className="rounded-md border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
                <p className="text-stone-500">No resources found. Try a different topic.</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {results.map((item, idx) => (
                <ResourceCard key={`${item.url}-${idx}`} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Searches + Empty state */}
        {!searched && (
          <>
            {recentSearches.length > 0 && (
              <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
                      Recent
                    </p>
                    <h3 className="mt-1 text-lg font-black tracking-tight text-stone-900">
                      Recent Searches
                    </h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((t) => (
                    <div
                      key={t}
                      className="group flex items-center gap-1 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 hover:border-amber-300 hover:text-amber-600 transition-colors cursor-pointer"
                      role="button"
                      onClick={() => handleLoadCached(t)}
                      title="Load from cache"
                    >
                      <span className="text-xs">🔁</span>
                      <span className="text-xs font-medium">{t}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecent(t);
                        }}
                        className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                        aria-label={`Remove ${t}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {loadingCached && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-stone-400">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    Loading from cache...
                  </div>
                )}
              </section>
            )}

            <section className="rounded-md border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <p className="text-stone-500">
                {recentSearches.length > 0
                  ? "Click a recent search to load cached results, or enter a new topic above."
                  : "Enter a topic above to discover curated learning resources."}
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
