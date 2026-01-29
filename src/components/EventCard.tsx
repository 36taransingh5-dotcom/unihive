import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/CategoryBadge';
import { downloadIcsFile } from '@/lib/calendar';
import { shareEvent } from '@/lib/share';
import { useToast } from '@/hooks/use-toast';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const societyName = event.societies?.name || 'Unknown Society';

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadIcsFile(event, societyName);
    toast({
      title: 'Calendar event downloaded',
      description: 'Open the .ics file to add to your calendar',
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await shareEvent(event, societyName);
    if (success) {
      toast({
        title: 'Event shared!',
        description: navigator.share ? 'Shared successfully' : 'Link copied to clipboard',
      });
    }
  };

  const startTime = format(new Date(event.starts_at), 'HH:mm');

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-card rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Time Column */}
        <div className="flex-shrink-0 w-14 text-center">
          <span className="text-lg font-bold text-foreground">{startTime}</span>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{societyName}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="flex-shrink-0">
          <CategoryBadge category={event.category} />
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-border">
              {event.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {event.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(event.starts_at), 'EEEE, MMMM d')} • {startTime} - {format(new Date(event.ends_at), 'HH:mm')}
                </span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddToCalendar}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button size="sm" variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
