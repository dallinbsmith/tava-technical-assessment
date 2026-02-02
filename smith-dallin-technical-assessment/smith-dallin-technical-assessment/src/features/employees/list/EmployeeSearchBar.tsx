import { Search, X } from "lucide-react";
import { EmployeeSearchBarProps } from "../__types__";

const EmployeeSearchBar = ({ value, onChange }: EmployeeSearchBarProps) => (
  <div className="relative flex-1 min-w-0">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
    <input
      type="text"
      placeholder="Search employees..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-9 pr-9 py-2 text-sm border border-border bg-elevated text-primary placeholder-muted focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-surface transition-colors"
      >
        <X className="w-3 h-3 text-muted" />
      </button>
    )}
  </div>
);

export default EmployeeSearchBar;
