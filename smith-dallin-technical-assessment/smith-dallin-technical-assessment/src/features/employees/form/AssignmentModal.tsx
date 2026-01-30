import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "../../../shared/lib/styles";
import { Modal } from "../../../shared/components/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  squads: string[];
  selectedDepartment: string;
  selectedSquads: string[];
  onSave: (department: string, squads: string[]) => void;
};

const AssignmentModal = ({
  isOpen,
  onClose,
  departments,
  squads,
  selectedDepartment,
  selectedSquads,
  onSave,
}: Props) => {
  const [department, setDepartment] = useState(selectedDepartment);
  const [assignedSquads, setAssignedSquads] =
    useState<string[]>(selectedSquads);

  useEffect(() => {
    if (isOpen) {
      setDepartment(selectedDepartment);
      setAssignedSquads(selectedSquads);
    }
  }, [isOpen, selectedDepartment, selectedSquads]);

  const toggleSquad = (squad: string) => {
    setAssignedSquads((prev) =>
      prev.includes(squad) ? prev.filter((s) => s !== squad) : [...prev, squad],
    );
  };

  const handleSave = () => {
    onSave(department, assignedSquads);
    onClose();
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        disabled={!department}
        className="px-4 py-2 text-sm font-medium bg-sky-900/40 text-sky-300 border border-sky-500/30 hover:bg-sky-900/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Department & Squads"
      footer={footer}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">
            Department <span className="text-red-400">*</span>
          </h3>
          <div className="space-y-1">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={cn(
                  "w-full flex items-center justify-between p-3 text-left transition-colors",
                  department === dept
                    ? "bg-sky-900/40 text-sky-300 border border-sky-500/30"
                    : "bg-elevated text-primary border border-transparent hover:bg-muted",
                )}
              >
                <span>{dept}</span>
                {department === dept && <Check className="w-4 h-4" />}
              </button>
            ))}
            {departments.length === 0 && (
              <p className="text-sm text-subtle p-3">
                No departments available
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Squads</h3>
          <div className="space-y-1">
            {squads.map((squad) => (
              <button
                key={squad}
                type="button"
                onClick={() => toggleSquad(squad)}
                className={cn(
                  "w-full flex items-center justify-between p-3 text-left transition-colors",
                  assignedSquads.includes(squad)
                    ? "bg-sky-900/40 text-sky-300 border border-sky-500/30"
                    : "bg-elevated text-primary border border-transparent hover:bg-muted",
                )}
              >
                <span>{squad}</span>
                {assignedSquads.includes(squad) && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
            {squads.length === 0 && (
              <p className="text-sm text-subtle p-3">No squads available</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssignmentModal;
