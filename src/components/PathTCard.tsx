export type PathTCardProps = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  href?: string;
};

export function PathTCard({
  id,
  title,
  category,
  thumbnail,
  href,
}: PathTCardProps) {
  const linkHref = href ?? `/learningpath/${id}`;

  return (
    <a
      className="group shrink-0 w-56 block hover:scale-105 transition-transform duration-300"
      href={linkHref}
      data-discover="true"
    >
      <div
        className="bg-white mb-3 overflow-hidden p-1 flex items-center justify-center"
        style={{ width: "13rem", aspectRatio: "16 / 9" }}
      >
        <img
          alt={title}
          loading="lazy"
          className="max-w-full max-h-full object-contain"
          src={thumbnail}
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-stone-400">{category}</p>
      </div>
    </a>
  );
}
