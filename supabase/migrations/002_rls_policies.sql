-- Migration: Row Level Security (RLS) Policies
-- Description: Implements comprehensive RLS policies for data security

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = user_id 
        AND subscription_plan = 'enterprise'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user owns resource
CREATE OR REPLACE FUNCTION public.owns_resource(user_id UUID, resource_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN user_id = resource_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User Profiles RLS Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON public.user_profiles
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- Orders RLS Policies
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all orders" ON public.orders
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- Downloads RLS Policies
CREATE POLICY "Users can view own downloads" ON public.downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads" ON public.downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own downloads" ON public.downloads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all downloads" ON public.downloads
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all downloads" ON public.downloads
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- Payments RLS Policies
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments" ON public.payments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all payments" ON public.payments
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- API Keys RLS Policies
CREATE POLICY "Users can view own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON public.api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all API keys" ON public.api_keys
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all API keys" ON public.api_keys
    FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete all API keys" ON public.api_keys
    FOR DELETE USING (public.is_admin(auth.uid()));

-- User Preferences RLS Policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all preferences" ON public.user_preferences
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all preferences" ON public.user_preferences
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- Saved Searches RLS Policies
CREATE POLICY "Users can view own saved searches" ON public.saved_searches
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own saved searches" ON public.saved_searches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved searches" ON public.saved_searches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved searches" ON public.saved_searches
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all saved searches" ON public.saved_searches
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all saved searches" ON public.saved_searches
    FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete all saved searches" ON public.saved_searches
    FOR DELETE USING (public.is_admin(auth.uid()));

-- Admin Logs RLS Policies (Admin only)
CREATE POLICY "Admins can view all admin logs" ON public.admin_logs
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert admin logs" ON public.admin_logs
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "System can insert admin logs" ON public.admin_logs
    FOR INSERT WITH CHECK (true); -- Allow system to log admin actions

-- System Settings RLS Policies
CREATE POLICY "Public can view public settings" ON public.system_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can view all settings" ON public.system_settings
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all settings" ON public.system_settings
    FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert settings" ON public.system_settings
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.avatar_url
    );
    
    -- Create default user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
    action_name TEXT,
    target_type TEXT,
    target_id UUID DEFAULT NULL,
    details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.admin_logs (
        admin_user_id,
        action,
        target_type,
        target_id,
        details,
        ip_address
    ) VALUES (
        auth.uid(),
        action_name,
        target_type,
        target_id,
        details,
        inet_client_addr()
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate API key
CREATE OR REPLACE FUNCTION public.validate_api_key(api_key TEXT)
RETURNS TABLE (
    user_id UUID,
    scopes TEXT[],
    is_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ak.user_id,
        ak.scopes,
        (ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > NOW()))
    FROM public.api_keys ak
    WHERE ak.key_hash = crypt(api_key, ak.key_hash)
    AND ak.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user credits
CREATE OR REPLACE FUNCTION public.get_user_credits(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    user_credits INTEGER;
BEGIN
    SELECT credits INTO user_credits
    FROM public.user_profiles
    WHERE id = user_uuid;
    
    RETURN COALESCE(user_credits, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(
    user_uuid UUID,
    amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    -- Get current credits
    SELECT credits INTO current_credits
    FROM public.user_profiles
    WHERE id = user_uuid;
    
    -- Check if user has enough credits
    IF current_credits < amount THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct credits
    UPDATE public.user_profiles
    SET credits = credits - amount
    WHERE id = user_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add credits
CREATE OR REPLACE FUNCTION public.add_credits(
    user_uuid UUID,
    amount INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.user_profiles
    SET credits = credits + amount
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
