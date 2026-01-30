import { X } from "lucide-react";

type FilterChip = {
  type: string;
  value: string;
  onRemove: () => void;
};

type Props = {
  filters: FilterChip[];
  onClearAll: () => void;
};

const ActiveFilters = ({ filters, onClearAll }: Props) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-sky-900/30 text-sky-300 border border-sky-500/30"
        >
          {filter.value}
          <button
            onClick={filter.onRemove}
            className="p-0.5 hover:bg-sky-500/30 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-muted hover:text-sky-400 underline"
      >
        Clear all
      </button>
    </div>
  );
};

export default ActiveFilters;
