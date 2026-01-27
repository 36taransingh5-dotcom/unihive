import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingAddButton() {
  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
    >
      <Link to="/dashboard/create">
        <Plus className="w-6 h-6" />
      </Link>
    </Button>
  );
}
