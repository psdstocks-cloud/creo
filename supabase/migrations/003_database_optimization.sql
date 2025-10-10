-- Migration: Database Optimization
-- Description: Adds performance optimizations, monitoring, and maintenance

-- Create additional indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_orders_user_status_created 
    ON public.orders(user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_status_created 
    ON public.orders(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_user_created 
    ON public.downloads(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_expires_at 
    ON public.downloads(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_user_status_created 
    ON public.payments(user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_stripe_customer_id 
    ON public.payments(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_api_keys_user_active 
    ON public.api_keys(user_id, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_public 
    ON public.saved_searches(user_id, is_public);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_target 
    ON public.admin_logs(created_at DESC, target_type);

-- Create partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_active 
    ON public.orders(user_id, created_at DESC) 
    WHERE status IN ('pending', 'processing');

CREATE INDEX IF NOT EXISTS idx_downloads_active 
    ON public.downloads(user_id, created_at DESC) 
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_payments_successful 
    ON public.payments(user_id, created_at DESC) 
    WHERE status = 'succeeded';

-- Create indexes for JSONB columns (for metadata queries)
CREATE INDEX IF NOT EXISTS idx_orders_metadata_gin 
    ON public.orders USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_payments_metadata_gin 
    ON public.payments USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_user_profiles_metadata_gin 
    ON public.user_profiles USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_saved_searches_filters_gin 
    ON public.saved_searches USING GIN (filters);

-- Create indexes for text search
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name_trgm 
    ON public.user_profiles USING GIN (full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_saved_searches_name_trgm 
    ON public.saved_searches USING GIN (name gin_trgm_ops);

-- Enable trigram extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_orders BIGINT,
    total_downloads BIGINT,
    total_payments BIGINT,
    total_spent BIGINT,
    credits_remaining INTEGER,
    last_order_date TIMESTAMPTZ,
    last_download_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.orders WHERE user_id = user_uuid) as total_orders,
        (SELECT COUNT(*) FROM public.downloads WHERE user_id = user_uuid) as total_downloads,
        (SELECT COUNT(*) FROM public.payments WHERE user_id = user_uuid AND status = 'succeeded') as total_payments,
        (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE user_id = user_uuid AND status = 'succeeded') as total_spent,
        (SELECT credits FROM public.user_profiles WHERE id = user_uuid) as credits_remaining,
        (SELECT MAX(created_at) FROM public.orders WHERE user_id = user_uuid) as last_order_date,
        (SELECT MAX(created_at) FROM public.downloads WHERE user_id = user_uuid) as last_download_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get system statistics
CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    total_orders BIGINT,
    pending_orders BIGINT,
    total_revenue BIGINT,
    total_downloads BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.user_profiles) as total_users,
        (SELECT COUNT(*) FROM public.user_profiles WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM public.orders) as total_orders,
        (SELECT COUNT(*) FROM public.orders WHERE status IN ('pending', 'processing')) as pending_orders,
        (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'succeeded') as total_revenue,
        (SELECT COUNT(*) FROM public.downloads WHERE is_active = true) as total_downloads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up expired downloads
CREATE OR REPLACE FUNCTION public.cleanup_expired_downloads()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE public.downloads
    SET is_active = false
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW() 
    AND is_active = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to archive old admin logs
CREATE OR REPLACE FUNCTION public.archive_old_admin_logs()
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- Archive logs older than 1 year
    DELETE FROM public.admin_logs
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user login timestamp
CREATE OR REPLACE FUNCTION public.update_user_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_profiles
    SET last_login_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update login timestamp
CREATE TRIGGER update_login_timestamp
    AFTER UPDATE OF last_sign_in_at ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.update_user_login();

-- Create function to validate order status transitions
CREATE OR REPLACE FUNCTION public.validate_order_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- Define valid status transitions
    IF OLD.status = 'pending' AND NEW.status NOT IN ('processing', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition from pending to %', NEW.status;
    END IF;
    
    IF OLD.status = 'processing' AND NEW.status NOT IN ('completed', 'failed', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition from processing to %', NEW.status;
    END IF;
    
    IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
        RAISE EXCEPTION 'Cannot change status from completed';
    END IF;
    
    IF OLD.status = 'failed' AND NEW.status NOT IN ('pending', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition from failed to %', NEW.status;
    END IF;
    
    IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
        RAISE EXCEPTION 'Cannot change status from cancelled';
    END IF;
    
    -- Set completed_at timestamp when status changes to completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to validate order status transitions
CREATE TRIGGER validate_order_status
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.validate_order_status_transition();

-- Create function to update download count
CREATE OR REPLACE FUNCTION public.increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.downloads
    SET 
        download_count = download_count + 1,
        last_downloaded_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log API key usage
CREATE OR REPLACE FUNCTION public.log_api_key_usage(api_key_hash TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.api_keys
    SET 
        last_used_at = NOW(),
        usage_count = usage_count + 1
    WHERE key_hash = api_key_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user activity summary
CREATE OR REPLACE FUNCTION public.get_user_activity_summary(
    user_uuid UUID,
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    orders_count BIGINT,
    downloads_count BIGINT,
    payments_count BIGINT,
    total_spent BIGINT,
    credits_used INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.orders 
         WHERE user_id = user_uuid 
         AND created_at >= NOW() - INTERVAL '1 day' * days_back) as orders_count,
        (SELECT COUNT(*) FROM public.downloads 
         WHERE user_id = user_uuid 
         AND created_at >= NOW() - INTERVAL '1 day' * days_back) as downloads_count,
        (SELECT COUNT(*) FROM public.payments 
         WHERE user_id = user_uuid 
         AND created_at >= NOW() - INTERVAL '1 day' * days_back) as payments_count,
        (SELECT COALESCE(SUM(amount), 0) FROM public.payments 
         WHERE user_id = user_uuid 
         AND status = 'succeeded'
         AND created_at >= NOW() - INTERVAL '1 day' * days_back) as total_spent,
        (SELECT COALESCE(SUM(credits_used), 0) FROM public.orders 
         WHERE user_id = user_uuid 
         AND created_at >= NOW() - INTERVAL '1 day' * days_back) as credits_used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get popular searches
CREATE OR REPLACE FUNCTION public.get_popular_searches(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    search_query TEXT,
    usage_count BIGINT,
    is_public BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ss.search_query,
        COUNT(*) as usage_count,
        ss.is_public
    FROM public.saved_searches ss
    WHERE ss.is_public = true
    GROUP BY ss.search_query, ss.is_public
    ORDER BY usage_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    user_uuid UUID,
    action_type TEXT,
    limit_count INTEGER DEFAULT 100,
    time_window INTERVAL DEFAULT '1 hour'
)
RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
BEGIN
    -- Check based on action type
    CASE action_type
        WHEN 'api_calls' THEN
            SELECT COUNT(*) INTO current_count
            FROM public.admin_logs
            WHERE admin_user_id = user_uuid
            AND action = 'api_call'
            AND created_at > NOW() - time_window;
            
        WHEN 'orders' THEN
            SELECT COUNT(*) INTO current_count
            FROM public.orders
            WHERE user_id = user_uuid
            AND created_at > NOW() - time_window;
            
        WHEN 'downloads' THEN
            SELECT COUNT(*) INTO current_count
            FROM public.downloads
            WHERE user_id = user_uuid
            AND created_at > NOW() - time_window;
            
        ELSE
            RETURN TRUE; -- Unknown action type, allow
    END CASE;
    
    RETURN current_count < limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for user dashboard data
CREATE OR REPLACE VIEW public.user_dashboard AS
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.credits,
    up.subscription_plan,
    up.created_at,
    up.last_login_at,
    COALESCE(order_stats.total_orders, 0) as total_orders,
    COALESCE(order_stats.pending_orders, 0) as pending_orders,
    COALESCE(download_stats.total_downloads, 0) as total_downloads,
    COALESCE(payment_stats.total_spent, 0) as total_spent
FROM public.user_profiles up
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status IN ('pending', 'processing')) as pending_orders
    FROM public.orders
    GROUP BY user_id
) order_stats ON up.id = order_stats.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_downloads
    FROM public.downloads
    WHERE is_active = true
    GROUP BY user_id
) download_stats ON up.id = download_stats.user_id
LEFT JOIN (
    SELECT 
        user_id,
        SUM(amount) as total_spent
    FROM public.payments
    WHERE status = 'succeeded'
    GROUP BY user_id
) payment_stats ON up.id = payment_stats.user_id;

-- Grant access to the view
GRANT SELECT ON public.user_dashboard TO authenticated;

-- Create view for admin dashboard
CREATE OR REPLACE VIEW public.admin_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM public.user_profiles) as total_users,
    (SELECT COUNT(*) FROM public.user_profiles WHERE is_active = true) as active_users,
    (SELECT COUNT(*) FROM public.orders) as total_orders,
    (SELECT COUNT(*) FROM public.orders WHERE status IN ('pending', 'processing')) as pending_orders,
    (SELECT COUNT(*) FROM public.downloads WHERE is_active = true) as total_downloads,
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'succeeded') as total_revenue,
    (SELECT COUNT(*) FROM public.payments WHERE status = 'succeeded' AND created_at >= NOW() - INTERVAL '30 days') as revenue_last_30_days;

-- Grant access to the view (admin only)
GRANT SELECT ON public.admin_dashboard TO authenticated;

-- Create function to get database size
CREATE OR REPLACE FUNCTION public.get_database_size()
RETURNS TABLE (
    table_name TEXT,
    row_count BIGINT,
    size_bytes BIGINT,
    size_mb NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins - n_tup_del as row_count,
        pg_total_relation_size(schemaname||'.'||tablename) as size_bytes,
        ROUND(pg_total_relation_size(schemaname||'.'||tablename) / 1024.0 / 1024.0, 2) as size_mb
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
