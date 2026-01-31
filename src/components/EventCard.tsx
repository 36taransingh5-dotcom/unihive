import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Share2, Navigation } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/CategoryBadge';
import { FoodBadge } from '@/components/FoodBadge';
import { SmartTagList } from '@/components/SmartTag';
import { MiniMap } from '@/components/MiniMap';
import { downloadIcsFile } from '@/lib/calendar';
import { shareEvent } from '@/lib/share';
import { useToast } from '@/hooks/use-toast';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const societyName = event.societies?.name || 'Unknown Society';

  // Check if event is happening now
  const now = new Date();
  const isLive = isWithinInterval(now, {
    start: new Date(event.starts_at),
    end: new Date(event.ends_at),
  });

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

  // Format time in 12-hour format
  const startTime = format(new Date(event.starts_at), 'h:mm a');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-card rounded-2xl p-4 cursor-pointer border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 relative"
    >
      {/* LIVE Indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Live</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        {/* Time Column */}
        <div className="flex-shrink-0 w-14 text-center pt-0.5">
          <span className="text-sm text-slate-500">{startTime}</span>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-extrabold text-lg text-foreground leading-tight truncate">{event.title}</h3>
          
          {/* Smart Tags Row */}
          {event.tags && event.tags.length > 0 && (
            <SmartTagList tags={event.tags} className="mt-1" />
          )}
          
          <p className="text-sm text-slate-600 font-medium">{societyName}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
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
