import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'

const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&h=506&fit=crop'

function typeTextColor(typeLabel: string): string {
  const t = typeLabel.toLowerCase()
  if (t.includes('linear')) return 'text-cyan-600'
  if (t.includes('struct')) return 'text-violet-600'
  if (t.includes('pool') || t.includes('partical')) return 'text-amber-600'
  return 'text-stone-400'
}

export type PathCardProps = {
  id: string
  title: string
  description: string
  category: string
  typeLabel: string
  level: string
  items?: number
  thumbnail: string
  hotScore?: number
}

export type PoolPath = PathCardProps

interface PoolPathCardProps {
  path: PathCardProps
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  showTypeLabel?: boolean
}

export function PathCard({ path, onEdit, onDelete, showTypeLabel = true }: PoolPathCardProps) {
  return (
    <article className="border border-stone-200 bg-white hover:border-stone-300 shadow-md hover:shadow-xl transition-all duration-500 rounded-md overflow-hidden h-full flex flex-col">
      {/* Category / Type / Level row */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-stone-100">
        <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">
          {path.category}
        </Badge>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
            {path.level}
          </span>
          {showTypeLabel && path.typeLabel && path.typeLabel !== 'Path' && (
            <span className={`text-[9px] font-bold uppercase tracking-wider ${typeTextColor(path.typeLabel)}`}>
              · {path.typeLabel}
            </span>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      <Link to={`/learningpath/${path.id}`} className="group block">
        <div className="relative bg-white overflow-hidden aspect-16/7">
          <img
            src={path.thumbnail || FALLBACK_THUMB}
            alt={path.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors"
              title={path.title}
            >
              {path.title}
            </h3>
          </div>
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 flex-1">{path.description}</p>
        </div>
      </Link>

      {/* Action buttons */}
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 px-5 py-3 border-t border-stone-200">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(path.id)}
              className="flex-1 h-8 text-xs font-semibold uppercase tracking-wider border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-colors rounded-sm"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(path.id)}
              className="flex-1 h-8 text-xs font-semibold uppercase tracking-wider border border-red-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors rounded-sm"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  )
}
