import { useState } from 'react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { TimeStreamFeed } from '@/components/TimeStreamFeed';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { filterEvents } from '@/lib/eventGrouping';
import type { FilterType } from '@/types/event';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { data: events = [], isLoading } = useEvents();
  const { user } = useAuth();

  const filteredEvents = filterEvents(events, activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <TimeStreamFeed events={filteredEvents} />
        )}
      </main>

      {user && <FloatingAddButton />}
    </div>
  );
};

export default Index;
