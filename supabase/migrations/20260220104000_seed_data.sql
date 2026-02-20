-- Migration to populate 12 diverse events for University of Southampton
-- This script creates the societies and events.
-- Note: Due to the UNIQUE constraint on user_id in the societies table, 
-- we are attributing all these events to a single "University of Southampton" society account for simplicity in this demo.

DO $$
DECLARE
    admin_user_id UUID := '3d9247aa-3edd-486d-a07b-931fb2c83fe4';
    univ_society_id UUID;
    now_ts TIMESTAMP WITH TIME ZONE := now();
BEGIN
    -- Ensure a general University society exists for these events
    INSERT INTO public.societies (name, user_id, description)
    VALUES ('University of Southampton', admin_user_id, 'Official and student-led events at the University of Southampton.')
    ON CONFLICT (user_id) DO UPDATE SET name = 'University of Southampton'
    RETURNING id INTO univ_society_id;

    -- Clear existing events for this society to avoid duplicates if re-running
    DELETE FROM public.events WHERE society_id = univ_society_id;

    -- 1. THE STARTUP PITCH (Hype Event)
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'Hive Beta Launch Party', 'Join us as we launch the Hive MVP! Built with Supabase and pure ambition.', 'Building 32, Room 1015', 'workshop', now_ts + interval '1 day 18 hours', now_ts + interval '1 day 21 hours', ARRAY['hype', 'launch', 'startup']);

    -- 2. THE TECH SOCIAL
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, food_detail, tags)
    VALUES (univ_society_id, 'CompSoc Social Night', 'A night of games, snacks, and networking for CS students.', 'The Campus Lounge', 'social', now_ts + interval '2 days 19 hours', now_ts + interval '2 days 23 hours', 'Pizza', ARRAY['free food', 'networking', 'games']);

    -- 3. THE CAREER PANEL
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'Consulting 101: 180DC Workshop', 'Learn the basics of social impact consulting and how to join our team.', 'Garden Court, Highfield', 'workshop', now_ts + interval '3 days 14 hours', now_ts + interval '3 days 16 hours', ARRAY['career', 'consulting']);

    -- 4. THE SPORTS TRIAL
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'Badminton Club Open Trials', 'All skill levels welcome. Bring your own racket if possible!', 'Sports Hall B, Jubilee', 'sports', now_ts + interval '4 days 10 hours', now_ts + interval '4 days 13 hours', ARRAY['trials', 'badminton']);

    -- 5. THE AI DEEP DIVE
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'AI & Ethics Symposium', 'Discussing the impact of Generative AI on student academics.', 'Building 67, Nightingale', 'workshop', now_ts + interval '5 days 14 hours', now_ts + interval '5 days 17 hours', ARRAY['AI', 'ethics', 'academic']);

    -- 6. THE GAME JAM
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, external_link, tags)
    VALUES (univ_society_id, 'Global Game Jam: Soton Edition', '48 hours to build a game based on the theme ''MASK''.', 'Mountbatten Building', 'workshop', now_ts + interval '7 days 17 hours', now_ts + interval '9 days 17 hours', 'https://globalgamejam.org', ARRAY['gamedev', 'hackathon']);

    -- 7. THE NIGHTLIFE EVENT
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'The Stag''s Karaoke Night', 'Sing your heart out at the best student pub on campus.', 'The Stag''s Head', 'social', now_ts + interval '1 day 20 hours', now_ts + interval '2 days 0 hours', ARRAY['karaoke', 'nightlife']);

    -- 8. THE MEDICAL TECH HUB
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'MedTech Hackathon Prep', 'Preparing for the upcoming health-tech challenge. All majors welcome.', 'General Hospital SGH', 'workshop', now_ts + interval '8 days 13 hours', now_ts + interval '8 days 16 hours', ARRAY['medtech', 'hackathon']);

    -- 9. THE CRICKET FIXTURE
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'Taran Tranquils vs. Physics Phantoms', 'A high-stakes indoor match. Come support the Tranquils!', 'Wide Lane Sports Ground', 'sports', now_ts + interval '6 days 11 hours', now_ts + interval '6 days 15 hours', ARRAY['cricket', 'competition']);

    -- 10. THE UI/UX SESSION
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'Figma Masterclass for Startups', 'Learn how to build prototypes like the Hive app using Figma.', 'Building 32, Lab 1', 'workshop', now_ts + interval '10 days 14 hours', now_ts + interval '10 days 17 hours', ARRAY['UI', 'UX', 'Figma']);

    -- 11. THE SUSTAINABILITY MEET
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, tags)
    VALUES (univ_society_id, 'Tetra Pak Recycling Drive', 'Volunteering to improve recycling efficiency on campus.', 'Susu Concourse', 'workshop', now_ts + interval '12 days 10 hours', now_ts + interval '12 days 14 hours', ARRAY['sustainability', 'volunteer']);

    -- 12. THE FINTECH TALK
    INSERT INTO public.events (society_id, title, description, location, category, starts_at, ends_at, external_link, tags)
    VALUES (univ_society_id, 'The Future of Digital Banking', 'Insights into how AI is changing Arch Insurance and the industry.', 'Murray Building', 'workshop', now_ts + interval '14 days 15 hours', now_ts + interval '14 days 17 hours', 'https://archinsurance.co.uk', ARRAY['fintech', 'banking', 'AI']);

END $$;
