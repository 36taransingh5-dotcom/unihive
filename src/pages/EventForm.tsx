import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addWeeks } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { MagicFillButton } from '@/components/MagicFillButton';
import { CategorySelect } from '@/components/CategorySelect';
import { TagInput } from '@/components/TagInput';
import { useAuth } from '@/hooks/useAuth';
import { useSociety } from '@/hooks/useSociety';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { EventCategory } from '@/types/event';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  category: z.enum(['workshop', 'social', 'sports', 'meeting']),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [freeFood, setFreeFood] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const { user, loading: authLoading } = useAuth();
  const { data: society } = useSociety();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      category: 'social',
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Auto-add "Free Food" tag when toggle is enabled
  useEffect(() => {
    if (freeFood) {
      if (!tags.some(tag => tag.toLowerCase() === 'free food')) {
        setTags(prev => [...prev, 'Free Food']);
      }
    } else {
      setTags(prev => prev.filter(tag => tag.toLowerCase() !== 'free food'));
    }
  }, [freeFood]);

  useEffect(() => {
    if (isEditing && society) {
      const loadEvent = async () => {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .eq('society_id', society.id)
          .single();

        if (error || !data) {
          toast({
            title: 'Event not found',
            variant: 'destructive',
          });
          navigate('/dashboard');
          return;
        }

        setValue('title', data.title);
        setValue('description', data.description || '');
        setValue('location', data.location);
        setValue('category', data.category as EventCategory);
        setValue('date', format(new Date(data.starts_at), 'yyyy-MM-dd'));
        setValue('startTime', format(new Date(data.starts_at), 'HH:mm'));
        setValue('endTime', format(new Date(data.ends_at), 'HH:mm'));
        
        // Load existing tags
        if (data.tags && data.tags.length > 0) {
          setTags(data.tags);
          // Check if Free Food tag exists
          if (data.tags.some((tag: string) => tag.toLowerCase() === 'free food')) {
            setFreeFood(true);
          }
        }
        
        setInitialLoading(false);
      };
      loadEvent();
    }
  }, [isEditing, id, society, setValue, toast, navigate]);

  const handleMagicFill = (data: {
    title: string | null;
    description: string | null;
    date: string | null;
    startTime: string | null;
    endTime: string | null;
    location: string | null;
    category: EventCategory | null;
  }) => {
    if (data.title) setValue('title', data.title);
    if (data.description) setValue('description', data.description);
    if (data.date) setValue('date', data.date);
    if (data.startTime) setValue('startTime', data.startTime);
    if (data.endTime) setValue('endTime', data.endTime);
    if (data.location) setValue('location', data.location);
    if (data.category) setValue('category', data.category);
  };

  const onSubmit = async (data: EventFormData) => {
    if (!society) return;

    setIsLoading(true);

    const startsAt = new Date(`${data.date}T${data.startTime}`);
    const endsAt = new Date(`${data.date}T${data.endTime}`);

    // Handle case where end time is after midnight
    if (endsAt <= startsAt) {
      endsAt.setDate(endsAt.getDate() + 1);
    }

    const baseEventData = {
      society_id: society.id,
      title: data.title,
      description: data.description || null,
      location: data.location,
      category: data.category as EventCategory,
      tags: tags.length > 0 ? tags : null,
    };

    let error;

    if (isEditing) {
      const result = await supabase
        .from('events')
        .update({
          ...baseEventData,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
        })
        .eq('id', id);
      error = result.error;
    } else if (repeatWeekly) {
      // Create 4 recurring events (this week + next 3 weeks)
      const events = [];
      for (let i = 0; i < 4; i++) {
        const weekStartsAt = addWeeks(startsAt, i);
        const weekEndsAt = addWeeks(endsAt, i);
        events.push({
          ...baseEventData,
          starts_at: weekStartsAt.toISOString(),
          ends_at: weekEndsAt.toISOString(),
        });
      }
      const result = await supabase.from('events').insert(events);
      error = result.error;
    } else {
      const result = await supabase.from('events').insert({
        ...baseEventData,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
      });
      error = result.error;
    }

    setIsLoading(false);

    if (error) {
      toast({
        title: isEditing ? 'Failed to update event' : 'Failed to create event',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      const eventCount = repeatWeekly && !isEditing ? 4 : 1;
      toast({
        title: isEditing ? 'Event updated!' : `Success: ${eventCount} ${eventCount > 1 ? 'recurring events' : 'event'} scheduled`,
        description: isEditing 
          ? 'Your changes have been saved.' 
          : repeatWeekly 
            ? 'Events created for the next 4 weeks.'
            : 'Your event is now live.',
      });
      queryClient.invalidateQueries({ queryKey: ['society-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/dashboard');
    }
  };

  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-safe">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')} 
          className="mb-4 font-bold border-2 border-black bg-white hover:bg-gray-100 rounded-lg"
          style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="bg-white border-2 border-black rounded-xl" style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
          <CardHeader>
            <CardTitle className="font-black text-2xl">{isEditing ? 'Edit Event' : 'Create New Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing && <MagicFillButton onExtracted={handleMagicFill} />}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Poker Night"
                  {...register('title')}
                  className="bg-white border-2 border-black rounded-lg placeholder:text-gray-500"
                  style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 font-medium">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell people what to expect..."
                  rows={3}
                  {...register('description')}
                  className="bg-white border-2 border-black rounded-lg placeholder:text-gray-500"
                  style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="font-bold">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Building 38, Room 1023"
                  {...register('location')}
                  className="bg-white border-2 border-black rounded-lg placeholder:text-gray-500"
                  style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                />
                {errors.location && (
                  <p className="text-sm text-red-600 font-medium">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Category</Label>
                <CategorySelect
                  value={watch('category')}
                  onValueChange={(value) => setValue('category', value)}
                />
              </div>

              {/* Event Tags */}
              <div className="space-y-2">
                <Label className="font-bold">Event Tags</Label>
                <TagInput
                  tags={tags}
                  onTagsChange={setTags}
                  placeholder="Type a tag and press Enter..."
                />
              </div>

              {/* Free Food Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white border-2 border-black" style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}>
                <div className="space-y-0.5">
                  <Label htmlFor="free-food" className="text-base font-bold cursor-pointer">
                    🍕 Free Food?
                  </Label>
                  <p className="text-sm text-gray-600">
                    Automatically add "Free Food" tag
                  </p>
                </div>
                <Switch
                  id="free-food"
                  checked={freeFood}
                  onCheckedChange={setFreeFood}
                />
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="font-bold">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                    className="bg-white border-2 border-black rounded-lg"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600 font-medium">{errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="font-bold">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                    className="bg-white border-2 border-black rounded-lg"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-red-600 font-medium">{errors.startTime.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="font-bold">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime')}
                    className="bg-white border-2 border-black rounded-lg"
                    style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-red-600 font-medium">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              {!isEditing && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-white border-2 border-black" style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="space-y-0.5">
                    <Label htmlFor="repeat-weekly" className="text-base font-bold cursor-pointer">
                      Repeat Weekly?
                    </Label>
                    <p className="text-sm text-gray-600">
                      Create this event for the next 4 weeks
                    </p>
                  </div>
                  <Switch
                    id="repeat-weekly"
                    checked={repeatWeekly}
                    onCheckedChange={setRepeatWeekly}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#FFDE59] text-black border-2 border-black font-bold hover:bg-[#FFE57A] rounded-lg text-lg py-6"
                style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                disabled={isLoading}
              >
                {isLoading
                  ? isEditing
                    ? 'Saving...'
                    : repeatWeekly
                    ? 'Creating 4 Events...'
                    : 'Creating...'
                  : isEditing
                  ? 'Save Changes'
                  : repeatWeekly
                  ? 'Create 4 Weekly Events'
                  : 'Create Event'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
