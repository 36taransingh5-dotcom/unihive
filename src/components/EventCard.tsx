import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Share2, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/CategoryBadge';
import { FoodBadge } from '@/components/FoodBadge';
import { MiniMap } from '@/components/MiniMap';
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

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.latitude && event.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`,
        '_blank'
      );
    } else {
      // Fallback to search by location name
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`,
        '_blank'
      );
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
          <h3 className="font-bold text-foreground truncate">{event.title}</h3>
          <p className="text-sm text-society-accent font-medium">{societyName}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Badges Column */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
          <CategoryBadge category={event.category} />
          <FoodBadge foodDetail={event.food_detail} />
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
              {/* Hero Image */}
              {event.image_url && (
                <div className="mb-4 -mx-4 -mt-4">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                </div>
              )}

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

              {/* Mini Map */}
              {event.latitude && event.longitude && (
                <div className="mb-4">
                  <MiniMap
                    latitude={event.latitude}
                    longitude={event.longitude}
                    locationName={event.location}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleAddToCalendar} className="rounded-xl">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button size="sm" variant="outline" onClick={handleGetDirections} className="rounded-xl">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <Button size="sm" variant="outline" onClick={handleShare} className="rounded-xl">
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
