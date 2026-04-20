import { Link } from "react-router-dom";

export type PoolPath = {
  id: string;
  title: string;
  description: string;
  category: string;
  typeLabel: string;
  level: string;
  items?: number;
  thumbnail: string;
  hotScore?: number;
  forkCount?: number;
};

interface PopularPathCardProps {
  path: PoolPath;
  index?: number;
}

export function PopularPathCard({ path, index = 0 }: PopularPathCardProps) {
  const num = String(index + 1).padStart(2, "0");
  const imgSrc = path.thumbnail || `https://picsum.photos/seed/${path.id}/800/500`;

  return (
    <Link
      to={`/learningpath/${path.id}`}
      className="group block relative rounded-sm overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
    >
      {/* Background image - absolute positioned */}
      <img
        src={imgSrc}
        alt={path.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${path.id}/800/500`;
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* Number */}
      <div className="absolute top-3 left-3">
        <span className="text-2xl font-bold text-white/60 tabular-nums tracking-tight">
          {num}
        </span>
      </div>

      {/* Content - relative z-10 */}
      <div className="relative z-10 p-4 min-h-40 flex flex-col justify-end">
        {/* Category */}
        <span className="text-[9px] font-medium uppercase tracking-wider text-white/80 mb-1">
          {path.category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-sm text-white leading-snug group-hover:text-amber-300 transition-colors duration-150 line-clamp-2 mb-2">
          {path.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-2">
          {path.description || "Curated learning resources for your journey."}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-1 text-[10px] text-white/60">
          <span>{path.level}</span>
          <span>·</span>
          <span>{path.items} items</span>
          {path.hotScore !== undefined && path.hotScore > 0 && (
            <>
              <span>·</span>
              <span className="text-amber-400">{path.hotScore}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
