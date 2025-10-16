-- 为诗词平台创建 RLS 策略

-- 1. 启用 RLS
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creation_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_likes ENABLE ROW LEVEL SECURITY;

-- 2. 创建策略

-- poems 表策略（经典诗词，所有人可读）
CREATE POLICY "poems_select_policy" ON poems
    FOR SELECT USING (true);

-- user_poems 表策略（用户诗词）
CREATE POLICY "user_poems_select_policy" ON user_poems
    FOR SELECT USING (true);

CREATE POLICY "user_poems_insert_policy" ON user_poems
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_poems_update_policy" ON user_poems
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_poems_delete_policy" ON user_poems
    FOR DELETE USING (auth.uid() = user_id);

-- user_profiles 表策略
CREATE POLICY "profiles_select_policy" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- creation_challenges 表策略（创作挑战，所有人可读）
CREATE POLICY "challenges_select_policy" ON creation_challenges
    FOR SELECT USING (true);

-- poem_comments 表策略
CREATE POLICY "comments_select_policy" ON poem_comments
    FOR SELECT USING (true);

CREATE POLICY "comments_insert_policy" ON poem_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_policy" ON poem_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_policy" ON poem_comments
    FOR DELETE USING (auth.uid() = user_id);

-- poem_likes 表策略
CREATE POLICY "likes_select_policy" ON poem_likes
    FOR SELECT USING (true);

CREATE POLICY "likes_insert_policy" ON poem_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_delete_policy" ON poem_likes
    FOR DELETE USING (auth.uid() = user_id);

-- 3. 创建用户注册时自动创建 profile 的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, created_at)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. 插入一些示例数据
INSERT INTO creation_challenges (title, description, theme) VALUES
('春日诗韵', '以春天为主题，创作一首诗词，体现春天的生机与美好', '春天'),
('月夜情思', '在月圆之夜，表达内心的情感与思考', '月亮'),
('山水画意', '用诗词描绘山水之美，展现自然的壮丽', '山水');

INSERT INTO poems (title, content, author, dynasty, category) VALUES
('春晓', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', '孟浩然', '唐', '五言绝句'),
('静夜思', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', '李白', '唐', '五言绝句'),
('登鹳雀楼', '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。', '王之涣', '唐', '五言绝句');
