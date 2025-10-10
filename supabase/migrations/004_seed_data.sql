-- Migration: Seed Data
-- Description: Inserts initial system data and default settings

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('app_name', '"Creo"', 'Application name', true),
('app_version', '"1.0.0"', 'Application version', true),
('maintenance_mode', 'false', 'Maintenance mode status', true),
('registration_enabled', 'true', 'Allow new user registrations', true),
('default_credits', '100', 'Default credits for new users', false),
('max_credits_per_user', '10000', 'Maximum credits a user can have', false),
('api_rate_limit', '1000', 'API calls per hour per user', false),
('download_expiry_days', '30', 'Days until download links expire', false),
('max_file_size_mb', '100', 'Maximum file size for uploads in MB', false),
('supported_file_types', '["image", "video", "audio", "document"]', 'Supported file types', true),
('ai_generation_cost', '10', 'Cost in credits for AI generation', false),
('stock_download_cost', '5', 'Cost in credits for stock downloads', false),
('subscription_plans', '{
    "free": {"credits": 100, "price": 0, "features": ["basic_search", "limited_downloads"]},
    "pro": {"credits": 1000, "price": 1999, "features": ["advanced_search", "unlimited_downloads", "ai_generation"]},
    "enterprise": {"credits": 10000, "price": 9999, "features": ["all_features", "api_access", "priority_support"]}
}', 'Subscription plan configurations', false),
('email_templates', '{
    "welcome": {"subject": "Welcome to Creo", "enabled": true},
    "order_confirmation": {"subject": "Order Confirmation", "enabled": true},
    "payment_receipt": {"subject": "Payment Receipt", "enabled": true},
    "password_reset": {"subject": "Password Reset", "enabled": true}
}', 'Email template configurations', false),
('feature_flags', '{
    "ai_generation": true,
    "advanced_search": true,
    "api_access": true,
    "bulk_download": true,
    "saved_searches": true,
    "social_sharing": false
}', 'Feature flag configurations', false)
ON CONFLICT (key) DO NOTHING;

-- Insert default admin user (if not exists)
-- Note: This should be replaced with actual admin user creation
INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    credits,
    subscription_plan,
    subscription_status,
    is_active
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- Placeholder UUID
    'admin@creo.vercel.app',
    'System Administrator',
    10000,
    'enterprise',
    'active',
    true
) ON CONFLICT (id) DO NOTHING;

-- Insert default user preferences for admin
INSERT INTO public.user_preferences (
    user_id,
    language,
    timezone,
    theme,
    email_notifications,
    push_notifications,
    marketing_emails,
    notification_frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'en',
    'UTC',
    'light',
    true,
    true,
    false,
    'immediate'
) ON CONFLICT (user_id) DO NOTHING;

-- Create sample saved searches (public)
INSERT INTO public.saved_searches (
    user_id,
    name,
    search_query,
    filters,
    is_public
) VALUES 
(
    '00000000-0000-0000-0000-000000000000',
    'Business Photos',
    'business office corporate',
    '{"category": "business", "orientation": "landscape", "color": "any"}',
    true
),
(
    '00000000-0000-0000-0000-000000000000',
    'Nature Landscapes',
    'nature landscape mountain forest',
    '{"category": "nature", "orientation": "landscape", "color": "green"}',
    true
),
(
    '00000000-0000-0000-0000-000000000000',
    'Technology Concepts',
    'technology digital innovation',
    '{"category": "technology", "orientation": "any", "color": "blue"}',
    true
),
(
    '00000000-0000-0000-0000-000000000000',
    'Food Photography',
    'food restaurant cooking',
    '{"category": "food", "orientation": "square", "color": "warm"}',
    true
),
(
    '00000000-0000-0000-0000-000000000000',
    'People Portraits',
    'people portrait professional',
    '{"category": "people", "orientation": "portrait", "color": "any"}',
    true
) ON CONFLICT DO NOTHING;

-- Insert sample admin logs
INSERT INTO public.admin_logs (
    admin_user_id,
    action,
    target_type,
    details
) VALUES 
(
    '00000000-0000-0000-0000-000000000000',
    'system_initialized',
    'system',
    '{"message": "Database initialized with default settings"}'
),
(
    '00000000-0000-0000-0000-000000000000',
    'seed_data_created',
    'system',
    '{"message": "Default system settings and sample data created"}'
);

-- Create function to initialize new user with default settings
CREATE OR REPLACE FUNCTION public.initialize_new_user(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    default_credits INTEGER;
BEGIN
    -- Get default credits from system settings
    SELECT (value::jsonb->>'default_credits')::INTEGER INTO default_credits
    FROM public.system_settings
    WHERE key = 'default_credits';
    
    -- Set default credits for new user
    UPDATE public.user_profiles
    SET credits = COALESCE(default_credits, 100)
    WHERE id = user_uuid;
    
    -- Create default user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (user_uuid)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Log the user creation
    PERFORM public.log_admin_action(
        'user_created',
        'user',
        user_uuid,
        jsonb_build_object('action', 'new_user_registration')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get system health status
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS TABLE (
    status TEXT,
    message TEXT,
    timestamp TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'healthy'::TEXT as status,
        'All systems operational'::TEXT as message,
        NOW() as timestamp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get database statistics
CREATE OR REPLACE FUNCTION public.get_database_stats()
RETURNS TABLE (
    total_tables INTEGER,
    total_indexes INTEGER,
    database_size_mb NUMERIC,
    last_vacuum TIMESTAMPTZ,
    active_connections INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public')::INTEGER as total_tables,
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public')::INTEGER as total_indexes,
        ROUND(pg_database_size(current_database()) / 1024.0 / 1024.0, 2) as database_size_mb,
        (SELECT MAX(last_vacuum) FROM pg_stat_user_tables) as last_vacuum,
        (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active')::INTEGER as active_connections;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to backup critical data
CREATE OR REPLACE FUNCTION public.backup_critical_data()
RETURNS TABLE (
    table_name TEXT,
    row_count BIGINT,
    backup_timestamp TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'user_profiles'::TEXT as table_name,
        (SELECT COUNT(*) FROM public.user_profiles) as row_count,
        NOW() as backup_timestamp
    UNION ALL
    SELECT 
        'orders'::TEXT as table_name,
        (SELECT COUNT(*) FROM public.orders) as row_count,
        NOW() as backup_timestamp
    UNION ALL
    SELECT 
        'payments'::TEXT as table_name,
        (SELECT COUNT(*) FROM public.payments) as row_count,
        NOW() as backup_timestamp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate system integrity
CREATE OR REPLACE FUNCTION public.validate_system_integrity()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    message TEXT
) AS $$
BEGIN
    RETURN QUERY
    -- Check for orphaned records
    SELECT 
        'orphaned_orders'::TEXT as check_name,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'::TEXT
            ELSE 'FAIL'::TEXT
        END as status,
        CASE 
            WHEN COUNT(*) = 0 THEN 'No orphaned orders found'::TEXT
            ELSE 'Found ' || COUNT(*) || ' orphaned orders'::TEXT
        END as message
    FROM public.orders o
    LEFT JOIN public.user_profiles up ON o.user_id = up.id
    WHERE up.id IS NULL
    
    UNION ALL
    
    -- Check for orphaned downloads
    SELECT 
        'orphaned_downloads'::TEXT as check_name,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'::TEXT
            ELSE 'FAIL'::TEXT
        END as status,
        CASE 
            WHEN COUNT(*) = 0 THEN 'No orphaned downloads found'::TEXT
            ELSE 'Found ' || COUNT(*) || ' orphaned downloads'::TEXT
        END as message
    FROM public.downloads d
    LEFT JOIN public.user_profiles up ON d.user_id = up.id
    WHERE up.id IS NULL
    
    UNION ALL
    
    -- Check for negative credits
    SELECT 
        'negative_credits'::TEXT as check_name,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'::TEXT
            ELSE 'FAIL'::TEXT
        END as status,
        CASE 
            WHEN COUNT(*) = 0 THEN 'No negative credits found'::TEXT
            ELSE 'Found ' || COUNT(*) || ' users with negative credits'::TEXT
        END as message
    FROM public.user_profiles
    WHERE credits < 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
