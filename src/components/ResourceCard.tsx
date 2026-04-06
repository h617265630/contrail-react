import { Badge } from '@/components/ui/Badge'

const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop'

function getCategoryColor(category?: string): string {
  const key = String(category || '').trim().toLowerCase() || 'other'
  const palette = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#84cc16']
  let hash = 0
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
}

export type UiResource = {
  id: number
  title: string
  summary: string
  categoryLabel: string
  categoryColor: string
  platform: string
  platformLabel: string
  typeLabel: string
  thumbnail: string
  resource_type: string
}

interface ResourceCardProps {
  resource: UiResource
  onOpen: () => void
  onAdd: () => void
  saving: boolean
  saved: boolean
}

export function ResourceCard({ resource, onOpen, onAdd, saving, saved }: ResourceCardProps) {
  return (
    <article
      className="group border border-stone-200 bg-white hover:border-stone-300 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-xl overflow-hidden flex flex-col cursor-pointer"
      onClick={onOpen}
    >
      {/* Type & Category row - top */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-stone-100">
        <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">
          {resource.typeLabel}
        </Badge>
        <span
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: resource.categoryColor || getCategoryColor(resource.categoryLabel) }}
        >
          {resource.categoryLabel}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="relative bg-white overflow-hidden p-2" style={{ width: '100%', aspectRatio: '16 / 9' }}>
        <img
          src={resource.thumbnail || FALLBACK_THUMB}
          alt={resource.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover rounded-sm transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col border-t border-stone-100">
        <h3
          className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors flex-1"
          title={resource.title}
        >
          {resource.title}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-2 mt-2">{resource.summary || 'No description available.'}</p>
        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-stone-100">
          <span className="text-[10px] text-stone-500 font-medium">{resource.platformLabel}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAdd() }}
            disabled={saving || saved}
            className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              saved ? 'text-emerald-500' : 'text-amber-600 hover:text-amber-700'
            } disabled:opacity-50`}
          >
            {saved ? 'Saved' : saving ? 'Saving…' : '+ Save'}
          </button>
        </div>
      </div>
    </article>
  )
}
