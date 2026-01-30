import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { cn } from "../../../shared/lib/styles";
import { Modal } from "../../../shared/components/Modal";
import { FilterModalProps } from "../__types__";

const FilterModal = ({
  isOpen,
  onClose,
  departments,
  squads,
  selectedDepartments,
  selectedSquads,
  onApply,
}: FilterModalProps) => {
  const [localDepartments, setLocalDepartments] =
    useState<string[]>(selectedDepartments);
  const [localSquads, setLocalSquads] = useState<string[]>(selectedSquads);

  useEffect(() => {
    if (isOpen) {
      setLocalDepartments(selectedDepartments);
      setLocalSquads(selectedSquads);
    }
  }, [isOpen, selectedDepartments, selectedSquads]);

  const toggleItem = (
    item: string,
    list: string[],
    setList: (items: string[]) => void,
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

  const handleApply = () => {
    onApply(localDepartments, localSquads);
    onClose();
  };

  const hasSelections = localDepartments.length > 0 || localSquads.length > 0;

  const footer = (
    <>
      <button
        onClick={() => {
          setLocalDepartments([]);
          setLocalSquads([]);
        }}
        disabled={!hasSelections}
        className={cn(
          "flex-1 px-4 py-2 text-sm font-medium transition-colors",
          hasSelections
            ? "text-muted hover:text-primary hover:bg-elevated"
            : "text-subtle cursor-not-allowed",
        )}
      >
        Clear
      </button>
      <button
        onClick={handleApply}
        className="flex-1 px-4 py-2 text-sm font-medium bg-sky-900/40 text-sky-300 border border-sky-500/30 hover:bg-sky-900/60 transition-colors"
      >
        Apply
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      icon={Filter}
      footer={footer}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Departments</h3>
          <div className="space-y-2">
            {departments.map((dept) => (
              <label
                key={dept}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localDepartments.includes(dept)}
                  onChange={() =>
                    toggleItem(dept, localDepartments, setLocalDepartments)
                  }
                  className="w-4 h-4 accent-sky-500"
                />
                <span className="text-sm text-primary">{dept}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Squads</h3>
          <div className="space-y-2">
            {squads.map((squad) => (
              <label
                key={squad}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localSquads.includes(squad)}
                  onChange={() =>
                    toggleItem(squad, localSquads, setLocalSquads)
                  }
                  className="w-4 h-4 accent-sky-500"
                />
                <span className="text-sm text-primary">{squad}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
