import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Share2, Navigation, Bookmark } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { SmartTagList } from '@/components/SmartTag';
import { CategoryPill } from '@/components/CategoryPill';
import { MiniMap } from '@/components/MiniMap';
import { downloadIcsFile } from '@/lib/calendar';
import { shareEvent } from '@/lib/share';
import { getCategoryShadow } from '@/lib/categoryStyles';
import { useToast } from '@/hooks/use-toast';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  const societyName = event.societies?.name || 'Unknown Society';

  // Get category-based shadow color
  const shadowStyle = useMemo(() => getCategoryShadow(event.category), [event.category]);

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
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`,
        '_blank'
      );
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? 'Bookmark removed' : 'Event bookmarked!',
      description: isBookmarked ? 'Removed from your saved events' : 'Added to your saved events',
    });
  };

  // Format time in 12-hour format
  const startTime = format(new Date(event.starts_at), 'h:mm a');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.12, delay: index * 0.04 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-white border-2 border-black rounded-xl p-4 cursor-pointer mb-4 transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
      style={{ 
        boxShadow: isExpanded ? 'none' : shadowStyle,
        transform: isExpanded ? 'translate(2px, 2px)' : undefined,
      }}
      whileHover={{ 
        boxShadow: 'none',
      }}
    >
      {/* Top Row: Title + Category Pill + Tags + LIVE + Bookmark */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Horizontal Title + Pills Row */}
          <div className="flex flex-row flex-wrap items-center gap-2">
            <h3 className="font-black text-xl text-black leading-tight whitespace-normal break-words">
              {event.title}
            </h3>
            {isLive && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className="text-xs font-black text-red-600 uppercase">LIVE</span>
              </div>
            )}
            {/* Category Pill - First, with colored border */}
            <CategoryPill category={event.category} />
            {/* Smart Tags inline */}
            {event.tags && event.tags.length > 0 && (
              <SmartTagList tags={event.tags} />
            )}
          </div>
        </div>
        
        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`flex-shrink-0 w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center transition-all duration-150 ${
            isBookmarked 
              ? 'bg-black text-white' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
          style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} strokeWidth={2.5} />
        </button>
      </div>

      {/* Description Preview (conditional truncation) */}
      {event.description && !isExpanded && (
        <p className="text-sm text-gray-600 mt-2 truncate whitespace-nowrap">
          {event.description}
        </p>
      )}

      {/* Bottom Row: Society Name | Date + Time | Location - COMPACT */}
      <div className="flex justify-start items-center gap-3 mt-3 pt-2 border-t-2 border-black">
        <span className="font-bold text-sm text-black flex-shrink-0">
          {societyName}
        </span>
        <span className="text-gray-400">•</span>
        <span className="font-bold text-sm text-black flex-shrink-0">
          {format(new Date(event.starts_at), 'EEE, MMM d')} • {startTime}
        </span>
        <span className="text-gray-400">•</span>
        <div className={`flex items-center gap-1 text-sm text-gray-700 ${!isExpanded ? 'truncate' : ''}`}>
          <MapPin className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
          <span className={!isExpanded ? 'truncate' : 'whitespace-normal break-words'}>{event.location}</span>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t-2 border-black">
              {/* Hero Image */}
              {event.image_url && (
                <div className="mb-4 -mx-4 -mt-4">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-40 object-cover border-b-2 border-black"
                  />
                </div>
              )}

              {event.description && (
                <p className="text-sm text-gray-700 mb-4 font-medium whitespace-normal break-words">
                  {event.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-black font-bold mb-4">
                <Calendar className="w-4 h-4" strokeWidth={2.5} />
                <span>
                  {format(new Date(event.starts_at), 'EEEE, MMMM d')} • {startTime} - {format(new Date(event.ends_at), 'h:mm a')}
                </span>
              </div>

              {/* Mini Map */}
              {event.latitude && event.longitude && (
                <div className="mb-4 border-2 border-black rounded-lg overflow-hidden brutal-shadow-sm">
                  <MiniMap
                    latitude={event.latitude}
                    longitude={event.longitude}
                    locationName={event.location}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAddToCalendar} 
                  className="bg-[#FFDE59] text-black border-2 border-black font-bold hover:bg-[#FFE57A] rounded-lg brutal-shadow-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" strokeWidth={2.5} />
                  Add to Calendar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleGetDirections} 
                  className="bg-white text-black border-2 border-black font-bold hover:bg-gray-100 rounded-lg brutal-shadow-sm"
                >
                  <Navigation className="w-4 h-4 mr-2" strokeWidth={2.5} />
                  Directions
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleShare} 
                  className="bg-white text-black border-2 border-black font-bold hover:bg-gray-100 rounded-lg brutal-shadow-sm"
                >
                  <Share2 className="w-4 h-4 mr-2" strokeWidth={2.5} />
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
