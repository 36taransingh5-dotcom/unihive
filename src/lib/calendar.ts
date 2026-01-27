import { format } from 'date-fns';
import type { Event } from '@/types/event';

export function generateIcsFile(event: Event, societyName: string): string {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hive//Event Radar//EN
BEGIN:VEVENT
UID:${event.id}@hive.app
DTSTAMP:${formatDate(new Date().toISOString())}
DTSTART:${formatDate(event.starts_at)}
DTEND:${formatDate(event.ends_at)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}\\n\\nOrganized by ${societyName}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

export function downloadIcsFile(event: Event, societyName: string): void {
  const icsContent = generateIcsFile(event, societyName);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
