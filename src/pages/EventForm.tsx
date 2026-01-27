import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
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

type EventForm = z.infer<typeof eventSchema>;

export default function EventForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
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
  } = useForm<EventForm>({
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
        setInitialLoading(false);
      };
      loadEvent();
    }
  }, [isEditing, id, society, setValue, toast, navigate]);

  const onSubmit = async (data: EventForm) => {
    if (!society) return;

    setIsLoading(true);

    const startsAt = new Date(`${data.date}T${data.startTime}`);
    const endsAt = new Date(`${data.date}T${data.endTime}`);

    // Handle case where end time is after midnight
    if (endsAt <= startsAt) {
      endsAt.setDate(endsAt.getDate() + 1);
    }

    const eventData = {
      society_id: society.id,
      title: data.title,
      description: data.description || null,
      location: data.location,
      category: data.category as EventCategory,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
    };

    let error;

    if (isEditing) {
      const result = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id);
      error = result.error;
    } else {
      const result = await supabase.from('events').insert(eventData);
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
      toast({
        title: isEditing ? 'Event updated!' : 'Event created!',
        description: isEditing ? 'Your changes have been saved.' : 'Your event is now live.',
      });
      queryClient.invalidateQueries({ queryKey: ['society-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/dashboard');
    }
  };

  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Poker Night"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell people what to expect..."
                  rows={3}
                  {...register('description')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Building 38, Room 1023"
                  {...register('location')}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={watch('category')}
                  onValueChange={(value) => setValue('category', value as EventCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-destructive">{errors.startTime.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime')}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-destructive">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? 'Saving...'
                    : 'Creating...'
                  : isEditing
                  ? 'Save Changes'
                  : 'Create Event'}
              </Button>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
}
