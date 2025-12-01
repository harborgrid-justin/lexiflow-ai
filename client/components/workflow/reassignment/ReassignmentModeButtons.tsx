import React from 'react';
import { UserPlus, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';

type Mode = 'single' | 'bulk' | 'user';

interface ReassignmentModeButtonsProps {
  onSelectMode: (mode: Mode) => void;
}

export const ReassignmentModeButtons: React.FC<ReassignmentModeButtonsProps> = ({ onSelectMode }) => (
  <div className="p-4 space-y-3">
    <Button
      variant="secondary"
      onClick={() => onSelectMode('single')}
      className="w-full justify-start"
      icon={UserPlus}
    >
      Reassign Single Task
    </Button>
    <Button
      variant="secondary"
      onClick={() => onSelectMode('bulk')}
      className="w-full justify-start"
      icon={Users}
    >
      Bulk Reassign Tasks
    </Button>
    <Button
      variant="secondary"
      onClick={() => onSelectMode('user')}
      className="w-full justify-start"
      icon={ArrowRight}
    >
      Reassign All from User
    </Button>
  </div>
);
