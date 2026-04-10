import { Search } from "lucide-react";
import {
  type UiResource,
  type ResourceType,
} from "../utils/pathUtils";

function displayType(t: ResourceType): string {
  return t === "video"
    ? "Video"
    : t === "document"
    ? "Doc"
    : t === "article"
    ? "Article"
    : t === "clip"
    ? "Clip"
    : "Link";
}

export type ResourceListProps = {
  allResources: UiResource[];
  selected?: UiResource[];
  searchQuery?: string;
  filteredResources?: UiResource[];
  newResourceUrl?: string;
  newResourceLoading?: boolean;
  newResourceError?: string;
  onSearchChange?: (query: string) => void;
  onNewResourceUrlChange?: (url: string) => void;
  onCreateResourceFromUrl?: () => void;
  onAddResource: (resource: UiResource) => void;
  onDragStart: (e: React.DragEvent, resource: UiResource) => void;
};

export function ResourceList({
  allResources,
  selected = [],
  searchQuery = "",
  filteredResources: externalFiltered,
  newResourceUrl = "",
  newResourceLoading = false,
  newResourceError = "",
  onSearchChange,
  onNewResourceUrlChange,
  onCreateResourceFromUrl,
  onAddResource,
  onDragStart,
}: ResourceListProps) {
  const filteredResources = externalFiltered ?? (
    searchQuery.trim()
      ? allResources.filter(
          (r) =>
            r.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            r.summary.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
      : allResources
  );

  const showSearch = onSearchChange !== undefined;
  const showCreateUrl = onCreateResourceFromUrl !== undefined;

  return (
    <div className="col-span-12 lg:col-span-6">
      <div className="bg-white rounded-md border border-stone-100 p-5 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-emerald-500 rounded-full" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-700">
              Resources
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            {filteredResources.length} available
          </span>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search your resources..."
              className="h-10 w-full pl-10 pr-4 border border-stone-200 rounded-sm bg-white text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-colors"
            />
          </div>
        )}

        {/* Create resource from URL */}
        {showCreateUrl && (
          <div className="rounded-sm border border-stone-100 bg-stone-50/50 p-3.5 mb-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-2">
              Create from URL
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={newResourceUrl}
                onChange={(e) => onNewResourceUrlChange?.(e.target.value)}
                placeholder="https://..."
                className="h-9 flex-1 px-3 border border-stone-200 rounded-sm bg-white text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                type="button"
                className="h-9 px-3 rounded-sm bg-stone-800 text-white text-xs font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50"
                disabled={!newResourceUrl.trim() || newResourceLoading}
                onClick={onCreateResourceFromUrl}
              >
                {newResourceLoading ? "…" : "Generate"}
              </button>
            </div>
            {newResourceError && (
              <p className="text-[10px] text-red-500 mt-1.5">
                {newResourceError}
              </p>
            )}
          </div>
        )}

        {/* Resource list */}
        <div className="max-h-105 overflow-y-auto space-y-2 pr-1 mb-3">
          {filteredResources.map((r) => (
            <div
              key={r.id}
              className={`group rounded-sm border bg-white transition-all cursor-pointer overflow-hidden ${
                selected.some((s) => s.id === r.id)
                  ? "border-emerald-200 opacity-50"
                  : "border-stone-100 hover:border-stone-200 hover:shadow-sm"
              }`}
              draggable={!selected.some((s) => s.id === r.id)}
              onDragStart={(e) =>
                !selected.some((s) => s.id === r.id) &&
                onDragStart(e, r)
              }
              onClick={() =>
                !selected.some((s) => s.id === r.id) && onAddResource(r)
              }
            >
              <div className="flex gap-3 p-3">
                <div className="w-20 h-14 shrink-0 rounded-none overflow-hidden bg-stone-100">
                  <img
                    src={r.thumbnail}
                    alt={r.title}
                    className="w-full h-full object-contain"
                    style={{
                      objectFit: "contain",
                      backgroundColor: "#f7f7f7",
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-stone-800 line-clamp-1 leading-snug">
                      {r.title}
                    </h3>
                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                      {displayType(r.type)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {r.summary}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredResources.length === 0 && (
            <p className="text-xs text-stone-400 text-center py-8">
              No resources found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
