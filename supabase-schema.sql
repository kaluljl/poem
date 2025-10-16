-- 诗境雅集 - Supabase数据库表结构
-- 请在Supabase控制台的SQL编辑器中执行此脚本

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户配置表 (扩展auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    level VARCHAR(20) DEFAULT '诗词新秀',
    total_poems INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_collections INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 经典诗词表
CREATE TABLE IF NOT EXISTS public.classic_poems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 唐诗、宋词、元曲等
    style VARCHAR(50), -- 五言绝句、七言律诗等
    theme VARCHAR(100), -- 主题标签
    translation TEXT, -- 白话译文
    annotation TEXT, -- 注释
    appreciation TEXT, -- 赏析
    difficulty_level INTEGER DEFAULT 1, -- 难度等级 1-5
    popularity_score INTEGER DEFAULT 0, -- 热度分数
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    collection_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户原创诗词表
CREATE TABLE IF NOT EXISTS public.user_poems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    style VARCHAR(50) NOT NULL, -- 诗词体裁
    theme VARCHAR(100), -- 创作主题
    emotions TEXT[], -- 情感标签数组
    keywords TEXT[], -- 关键词数组
    is_ai_assisted BOOLEAN DEFAULT FALSE, -- 是否AI辅助创作
    ai_prompt TEXT, -- AI创作提示词
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, private
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    collection_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- 诗词点赞表
CREATE TABLE IF NOT EXISTS public.poem_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    poem_id UUID, -- 可以是classic_poems或user_poems的id
    poem_type VARCHAR(20) NOT NULL, -- 'classic' 或 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, poem_id, poem_type)
);

-- 诗词收藏表
CREATE TABLE IF NOT EXISTS public.poem_collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    poem_id UUID,
    poem_type VARCHAR(20) NOT NULL, -- 'classic' 或 'user'
    collection_name VARCHAR(100) DEFAULT '默认收藏夹',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, poem_id, poem_type)
);

-- 诗词评论表
CREATE TABLE IF NOT EXISTS public.poem_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES public.user_poems(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.poem_comments(id) ON DELETE CASCADE, -- 回复评论
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户关注表
CREATE TABLE IF NOT EXISTS public.user_follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 创作挑战表
CREATE TABLE IF NOT EXISTS public.creation_challenges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    theme VARCHAR(100),
    style VARCHAR(50), -- 指定体裁
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    participant_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, ended, draft
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 挑战参与表
CREATE TABLE IF NOT EXISTS public.challenge_participations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    challenge_id UUID REFERENCES public.creation_challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES public.user_poems(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(challenge_id, user_id)
);

-- 系统通知表
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- like, comment, follow, challenge等
    title VARCHAR(200) NOT NULL,
    content TEXT,
    related_id UUID, -- 相关对象ID
    related_type VARCHAR(50), -- 相关对象类型
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_poems_user_id ON public.user_poems(user_id);
CREATE INDEX IF NOT EXISTS idx_user_poems_status ON public.user_poems(status);
CREATE INDEX IF NOT EXISTS idx_user_poems_created_at ON public.user_poems(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_classic_poems_category ON public.classic_poems(category);
CREATE INDEX IF NOT EXISTS idx_classic_poems_author ON public.classic_poems(author);
CREATE INDEX IF NOT EXISTS idx_poem_likes_user_poem ON public.poem_likes(user_id, poem_id, poem_type);
CREATE INDEX IF NOT EXISTS idx_poem_comments_poem_id ON public.poem_comments(poem_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, is_read);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classic_poems_updated_at BEFORE UPDATE ON public.classic_poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_poems_updated_at BEFORE UPDATE ON public.user_poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poem_comments_updated_at BEFORE UPDATE ON public.poem_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略

-- 用户配置策略
CREATE POLICY "用户可以查看所有用户配置" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "用户只能更新自己的配置" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "用户可以插入自己的配置" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 用户诗词策略
CREATE POLICY "所有人可以查看已发布的诗词" ON public.user_poems FOR SELECT USING (status = 'published' OR user_id = auth.uid());
CREATE POLICY "用户只能管理自己的诗词" ON public.user_poems FOR ALL USING (user_id = auth.uid());

-- 点赞策略
CREATE POLICY "用户可以查看所有点赞" ON public.poem_likes FOR SELECT USING (true);
CREATE POLICY "用户只能管理自己的点赞" ON public.poem_likes FOR ALL USING (user_id = auth.uid());

-- 收藏策略
CREATE POLICY "用户只能查看自己的收藏" ON public.poem_collections FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "用户只能管理自己的收藏" ON public.poem_collections FOR ALL USING (user_id = auth.uid());

-- 评论策略
CREATE POLICY "所有人可以查看评论" ON public.poem_comments FOR SELECT USING (true);
CREATE POLICY "认证用户可以发表评论" ON public.poem_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户只能更新自己的评论" ON public.poem_comments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "用户只能删除自己的评论" ON public.poem_comments FOR DELETE USING (user_id = auth.uid());

-- 关注策略
CREATE POLICY "所有人可以查看关注关系" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "用户只能管理自己的关注" ON public.user_follows FOR ALL USING (follower_id = auth.uid());

-- 通知策略
CREATE POLICY "用户只能查看自己的通知" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "用户只能更新自己的通知" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- 插入一些示例经典诗词数据
INSERT INTO public.classic_poems (title, author, dynasty, content, category, style, theme, translation, annotation, appreciation) VALUES
('静夜思', '李白', '唐代', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', '唐诗', '五言绝句', '思乡', '床前洒满了明亮的月光，以为是地上结了霜。抬头望着天上的明月，低头思念着故乡。', '床：井栏。霜：白色的霜。', '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句写诗人在作客他乡的特定环境中一刹那间所产生的错觉。'),
('春晓', '孟浩然', '唐代', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', '唐诗', '五言绝句', '春景', '春天睡觉不知不觉天就亮了，到处都能听到鸟儿的啼叫声。回想昨夜的风雨声，不知道有多少花儿凋落了。', '晓：天亮。啼鸟：鸟的啼叫声。', '这首诗是诗人隐居在鹿门山时所作，意境十分优美。诗人抓住春天的早晨刚刚醒来时的一瞬间展开联想，描绘了一幅春天早晨绚丽的图景。'),
('水调歌头·明月几时有', '苏轼', '宋代', '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。', '宋词', '词', '中秋思亲', '明月什么时候开始有的呢？我举起酒杯询问青天。不知道天上的宫殿，今晚是什么年代。我想要乘风回到天上，又担心在美玉砌成的楼宇，高空中经受不住寒冷。翩翩起舞玩赏着月下清影，哪像是在人间。', '把酒：举杯饮酒。宫阙：宫殿。琼楼玉宇：美玉砌成的楼宇，指月中宫殿。', '这首词是苏轼在密州时所作。全词运用形象描绘手法，勾勒出一种皓月当空、亲人千里、孤高旷远的境界氛围。');

-- 创建一些示例用户配置（需要先有认证用户）
-- 这部分数据需要在用户注册后通过应用程序插入

-- 创建函数：自动创建用户配置
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, display_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：用户注册时自动创建配置
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 创建函数：更新诗词统计
CREATE OR REPLACE FUNCTION update_poem_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新点赞数
    IF TG_TABLE_NAME = 'poem_likes' THEN
        IF TG_OP = 'INSERT' THEN
            IF NEW.poem_type = 'classic' THEN
                UPDATE public.classic_poems SET like_count = like_count + 1 WHERE id = NEW.poem_id;
            ELSIF NEW.poem_type = 'user' THEN
                UPDATE public.user_poems SET like_count = like_count + 1 WHERE id = NEW.poem_id;
            END IF;
        ELSIF TG_OP = 'DELETE' THEN
            IF OLD.poem_type = 'classic' THEN
                UPDATE public.classic_poems SET like_count = like_count - 1 WHERE id = OLD.poem_id;
            ELSIF OLD.poem_type = 'user' THEN
                UPDATE public.user_poems SET like_count = like_count - 1 WHERE id = OLD.poem_id;
            END IF;
        END IF;
    END IF;
    
    -- 更新收藏数
    IF TG_TABLE_NAME = 'poem_collections' THEN
        IF TG_OP = 'INSERT' THEN
            IF NEW.poem_type = 'classic' THEN
                UPDATE public.classic_poems SET collection_count = collection_count + 1 WHERE id = NEW.poem_id;
            ELSIF NEW.poem_type = 'user' THEN
                UPDATE public.user_poems SET collection_count = collection_count + 1 WHERE id = NEW.poem_id;
            END IF;
        ELSIF TG_OP = 'DELETE' THEN
            IF OLD.poem_type = 'classic' THEN
                UPDATE public.classic_poems SET collection_count = collection_count - 1 WHERE id = OLD.poem_id;
            ELSIF OLD.poem_type = 'user' THEN
                UPDATE public.user_poems SET collection_count = collection_count - 1 WHERE id = OLD.poem_id;
            END IF;
        END IF;
    END IF;
    
    -- 更新评论数
    IF TG_TABLE_NAME = 'poem_comments' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE public.user_poems SET comment_count = comment_count + 1 WHERE id = NEW.poem_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE public.user_poems SET comment_count = comment_count - 1 WHERE id = OLD.poem_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 创建统计更新触发器
CREATE TRIGGER update_like_stats AFTER INSERT OR DELETE ON public.poem_likes FOR EACH ROW EXECUTE FUNCTION update_poem_stats();
CREATE TRIGGER update_collection_stats AFTER INSERT OR DELETE ON public.poem_collections FOR EACH ROW EXECUTE FUNCTION update_poem_stats();
CREATE TRIGGER update_comment_stats AFTER INSERT OR DELETE ON public.poem_comments FOR EACH ROW EXECUTE FUNCTION update_poem_stats();
