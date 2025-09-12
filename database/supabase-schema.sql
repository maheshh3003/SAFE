-- SAFE Mental Health Platform - Complete Supabase Schema
-- This schema supports both individual students and university administration
-- Run this entire script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    medical_history TEXT,
    current_medications TEXT,
    preferred_therapist_gender TEXT,
    session_preferences TEXT,
    user_type TEXT DEFAULT 'student' CHECK (user_type IN ('student', 'university_admin', 'super_admin')),
    university_id UUID,
    student_id TEXT,
    program TEXT,
    academic_year TEXT,
    wellness_score FLOAT DEFAULT 0.0,
    risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    last_wellness_check TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- UNIVERSITIES TABLE
-- =============================================
CREATE TABLE public.universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    admin_user_id UUID,
    admin_name TEXT NOT NULL,
    admin_title TEXT,
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'suspended', 'cancelled')),
    student_limit INTEGER DEFAULT 1000,
    current_student_count INTEGER DEFAULT 0,
    settings JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key relationship between profiles and universities
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_university 
FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE SET NULL;

-- Add foreign key for university admin
ALTER TABLE public.universities 
ADD CONSTRAINT fk_universities_admin 
FOREIGN KEY (admin_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- =============================================
-- THERAPISTS TABLE
-- =============================================
CREATE TABLE public.therapists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    specialization TEXT[] DEFAULT '{}',
    experience_years INTEGER NOT NULL,
    education TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    bio TEXT,
    profile_image_url TEXT,
    gender TEXT,
    languages TEXT[] DEFAULT ARRAY['English'],
    rating FLOAT DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    consultation_fee FLOAT NOT NULL,
    available_days TEXT[] DEFAULT '{}',
    available_time_start TIME NOT NULL,
    available_time_end TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SESSION TYPES TABLE
-- =============================================
CREATE TABLE public.session_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price FLOAT NOT NULL,
    is_online BOOLEAN DEFAULT TRUE,
    is_offline BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TIME SLOTS TABLE
-- =============================================
CREATE TABLE public.time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(therapist_id, date, start_time)
);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    session_type_id UUID NOT NULL REFERENCES public.session_types(id) ON DELETE CASCADE,
    time_slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
    booking_date TIMESTAMPTZ DEFAULT NOW(),
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    session_type TEXT CHECK (session_type IN ('online', 'offline')),
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
    total_amount FLOAT NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CHAT MESSAGES TABLE
-- =============================================
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    file_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_profiles_university_id ON public.profiles(university_id);
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_risk_level ON public.profiles(risk_level);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_student_id ON public.profiles(student_id);

CREATE INDEX idx_universities_domain ON public.universities(domain);
CREATE INDEX idx_universities_admin_user_id ON public.universities(admin_user_id);

CREATE INDEX idx_therapists_email ON public.therapists(email);
CREATE INDEX idx_therapists_is_active ON public.therapists(is_active);

CREATE INDEX idx_time_slots_therapist_date ON public.time_slots(therapist_id, date);
CREATE INDEX idx_time_slots_available ON public.time_slots(is_available);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_therapist_id ON public.bookings(therapist_id);
CREATE INDEX idx_bookings_session_date ON public.bookings(session_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);

CREATE INDEX idx_chat_messages_booking_id ON public.chat_messages(booking_id);
CREATE INDEX idx_chat_messages_sender_id ON public.chat_messages(sender_id);

-- =============================================
-- FUNCTIONS FOR UNIVERSITY STUDENT COUNT
-- =============================================
CREATE OR REPLACE FUNCTION increment_student_count(university_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.universities 
    SET current_student_count = current_student_count + 1,
        updated_at = NOW()
    WHERE id = university_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_student_count(university_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.universities 
    SET current_student_count = GREATEST(0, current_student_count - 1),
        updated_at = NOW()
    WHERE id = university_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR AUTOMATIC PROFILE CREATION
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        user_type,
        university_id,
        student_id,
        program,
        academic_year
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
        CASE 
            WHEN NEW.raw_user_meta_data->>'university_id' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'university_id')::UUID
            ELSE NULL
        END,
        NEW.raw_user_meta_data->>'student_id',
        NEW.raw_user_meta_data->>'program',
        NEW.raw_user_meta_data->>'academic_year'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TRIGGER FOR UPDATED_AT TIMESTAMPS
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER universities_updated_at BEFORE UPDATE ON public.universities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER therapists_updated_at BEFORE UPDATE ON public.therapists FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "University admins can view their students" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.user_type = 'university_admin'
            AND p.university_id = profiles.university_id
        )
        OR auth.uid() = id
    );

CREATE POLICY "University admins can update their students" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.user_type = 'university_admin'
            AND p.university_id = profiles.university_id
        )
        OR auth.uid() = id
    );

CREATE POLICY "University admins can insert students" ON public.profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.user_type = 'university_admin'
            AND p.university_id = profiles.university_id
        )
        OR auth.uid() = id
    );

-- UNIVERSITIES POLICIES
CREATE POLICY "University admins can view their university" ON public.universities
    FOR SELECT USING (
        admin_user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.user_type = 'university_admin'
            AND p.university_id = universities.id
        )
    );

CREATE POLICY "University admins can update their university" ON public.universities
    FOR UPDATE USING (
        admin_user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.user_type = 'university_admin'
            AND p.university_id = universities.id
        )
    );

CREATE POLICY "Anyone can create university" ON public.universities
    FOR INSERT WITH CHECK (true);

-- THERAPISTS POLICIES (readable by all authenticated users)
CREATE POLICY "Authenticated users can view therapists" ON public.therapists
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- SESSION TYPES POLICIES (readable by all authenticated users)
CREATE POLICY "Authenticated users can view session types" ON public.session_types
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- TIME SLOTS POLICIES (readable by all authenticated users)
CREATE POLICY "Authenticated users can view time slots" ON public.time_slots
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- BOOKINGS POLICIES
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.user_type = 'university_admin'
            AND EXISTS (
                SELECT 1 FROM public.profiles student
                WHERE student.id = bookings.user_id
                AND student.university_id = p.university_id
            )
        )
    );

CREATE POLICY "Users can create own bookings" ON public.bookings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (user_id = auth.uid());

-- REVIEWS POLICIES
CREATE POLICY "Users can view relevant reviews" ON public.reviews
    FOR SELECT USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = reviews.booking_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own reviews" ON public.reviews
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- CHAT MESSAGES POLICIES
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT USING (
        sender_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = chat_messages.booking_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample session types
INSERT INTO public.session_types (name, description, duration_minutes, price, is_online, is_offline) VALUES
('Individual Therapy', 'One-on-one therapy session', 50, 150.00, true, true),
('Group Therapy', 'Group therapy session with 4-6 participants', 90, 75.00, true, false),
('Crisis Counseling', 'Immediate crisis intervention session', 30, 200.00, true, false),
('Couples Therapy', 'Therapy session for couples', 60, 200.00, true, true),
('Family Therapy', 'Therapy session for families', 90, 250.00, false, true);

-- Insert sample therapists
INSERT INTO public.therapists (
    full_name, email, phone, specialization, experience_years, education, 
    license_number, bio, gender, languages, consultation_fee, 
    available_days, available_time_start, available_time_end
) VALUES
(
    'Dr. Sarah Johnson', 'sarah.johnson@safe.com', '+1-555-0101',
    ARRAY['Anxiety', 'Depression', 'PTSD'], 8,
    'PhD in Clinical Psychology, Harvard University',
    'LIC12345', 'Specialized in cognitive behavioral therapy with focus on anxiety and trauma.',
    'Female', ARRAY['English', 'Spanish'], 150.00,
    ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    '09:00:00', '17:00:00'
),
(
    'Dr. Michael Chen', 'michael.chen@safe.com', '+1-555-0102',
    ARRAY['ADHD', 'Learning Disabilities', 'Academic Stress'], 12,
    'PhD in Educational Psychology, Stanford University',
    'LIC12346', 'Expert in student mental health and academic performance.',
    'Male', ARRAY['English', 'Mandarin'], 175.00,
    ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday'],
    '08:00:00', '16:00:00'
),
(
    'Dr. Emily Rodriguez', 'emily.rodriguez@safe.com', '+1-555-0103',
    ARRAY['Depression', 'Bipolar Disorder', 'Substance Abuse'], 15,
    'MD Psychiatry, Johns Hopkins University',
    'LIC12347', 'Board-certified psychiatrist specializing in mood disorders.',
    'Female', ARRAY['English', 'Spanish', 'Portuguese'], 200.00,
    ARRAY['Tuesday', 'Thursday', 'Friday', 'Saturday'],
    '10:00:00', '18:00:00'
);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SAFE Mental Health Platform Database Schema Created Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: profiles, universities, therapists, session_types, time_slots, bookings, reviews, chat_messages';
    RAISE NOTICE 'Policies created: Row Level Security enabled for all tables';
    RAISE NOTICE 'Functions created: Student count management, auto profile creation';
    RAISE NOTICE 'Sample data inserted: Session types and therapists';
    RAISE NOTICE '';
    RAISE NOTICE 'Your database is ready for the SAFE Mental Health Platform!';
    RAISE NOTICE '========================================';
END $$;