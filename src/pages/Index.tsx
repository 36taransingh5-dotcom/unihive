import { useState, useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { TimeStreamFeed } from '@/components/TimeStreamFeed';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { AskHive } from '@/components/AskHive';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { useEvents } from '@/hooks/useEvents';
import { useSocieties } from '@/hooks/useSocieties';
import { useAuth } from '@/hooks/useAuth';
import { filterEvents } from '@/lib/eventGrouping';
import type { FilterType, FilterState } from '@/types/event';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [aiFilteredEventIds, setAiFilteredEventIds] = useState<string[] | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    societyId: null,
    category: null,
    freeFoodOnly: false,
  });

  const { data: events = [], isLoading } = useEvents();
  const { data: societies = [] } = useSocieties();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Apply all filters
  const filteredEvents = useMemo(() => {
    let result = filterEvents(events, activeFilter);

    // Apply society filter
    if (advancedFilters.societyId) {
      result = result.filter(e => e.society_id === advancedFilters.societyId);
    }

    // Apply category filter
    if (advancedFilters.category) {
      result = result.filter(e => e.category === advancedFilters.category);
    }

    // Apply free food filter
    if (advancedFilters.freeFoodOnly) {
      result = result.filter(e => e.food_detail !== null);
    }

    return result;
  }, [events, activeFilter, advancedFilters]);

  const hasActiveAdvancedFilters =
    advancedFilters.societyId !== null ||
    advancedFilters.category !== null ||
    advancedFilters.freeFoodOnly;

  const clearAllFilters = () => {
    setAdvancedFilters({
      societyId: null,
      category: null,
      freeFoodOnly: false,
    });
    setActiveFilter('all');
  };

  // Handle AI filter change
  const handleAiFilter = (eventIds: string[] | null) => {
    setAiFilteredEventIds(eventIds);
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Ambient glow blob for dark mode */}
      {isDarkMode && (
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
      )}
      <Header />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <main className="container max-w-2xl mx-auto px-4 py-6 pb-safe">
        {/* Ask Hive AI Search */}
        <div className="mb-4">
          <AskHive events={events} onFilterEvents={handleAiFilter} />
        </div>

        {/* Advanced Filters */}
        <div className="mb-6">
          <AdvancedFilters
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            societies={societies}
            hasActiveFilters={hasActiveAdvancedFilters}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-start" />
          </div>
        ) : (
          <TimeStreamFeed
            events={filteredEvents}
            activeFilter={activeFilter}
            filteredEventIds={aiFilteredEventIds}
            hasAdvancedFilters={hasActiveAdvancedFilters}
            onClearFilters={clearAllFilters}
          />
        )}
      </main>

      {user && <FloatingAddButton />}
    </div>
  );
};

export default Index;
