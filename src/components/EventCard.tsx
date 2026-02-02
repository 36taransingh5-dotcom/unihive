import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Share2, Navigation } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
  const societyLogo = event.societies?.logo_url;

  // Check if event is happening now
  const now = new Date();
  const isLive = isWithinInterval(now, {
    start: new Date(event.starts_at),
    end: new Date(event.ends_at),
  });

  // Get society initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
      className="bg-white rounded-2xl p-4 cursor-pointer border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Top Row: Title + LIVE Indicator */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-extrabold text-lg text-foreground leading-tight flex-1 min-w-0 truncate">
          {event.title}
        </h3>
        {isLive && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Live</span>
          </div>
        )}
      </div>

      {/* Smart Tags Row */}
      {event.tags && event.tags.length > 0 && (
        <SmartTagList tags={event.tags} className="mt-2" />
      )}

      {/* Description - truncated to 2 lines */}
      {event.description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {event.description}
        </p>
      )}

      {/* Footer Row: Avatar + Society Name | Time */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={societyLogo || undefined} alt={societyName} />
            <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
              {getInitials(societyName)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-slate-600 truncate">
            {societyName}
          </span>
        </div>
        <span className="text-sm text-slate-500 flex-shrink-0">
          {startTime}
        </span>
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

              {/* Location */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(event.starts_at), 'EEEE, MMMM d')} • {startTime} - {format(new Date(event.ends_at), 'h:mm a')}
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
