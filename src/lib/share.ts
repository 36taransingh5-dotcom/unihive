import type { Event } from '@/types/event';
import { format } from 'date-fns';

export async function shareEvent(event: Event, societyName: string): Promise<boolean> {
  const shareData = {
    title: event.title,
    text: `${event.title} by ${societyName}\n📍 ${event.location}\n📅 ${format(new Date(event.starts_at), 'EEEE, MMMM d @ HH:mm')}`,
    url: window.location.href,
  };

  // Check if Web Share API is available
  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // User cancelled or share failed
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }

  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(
      `${event.title} by ${societyName}\n📍 ${event.location}\n📅 ${format(new Date(event.starts_at), 'EEEE, MMMM d @ HH:mm')}\n\n${window.location.href}`
    );
    return true;
  } catch {
    return false;
  }
}
