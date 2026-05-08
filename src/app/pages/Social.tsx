import { useState } from 'react';
import {
  Heart, MessageCircle, Share2, Trophy, Flame, Users,
  Plus, Search, TrendingUp, Award, ChevronRight, Star,
  Zap, ThumbsUp, UserPlus, Footprints, Dumbbell
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const RUNNING_IMG = 'https://images.unsplash.com/photo-1773681823208-7f3657c0688f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const FITNESS_IMG = 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const FOOD_IMG = 'https://images.unsplash.com/photo-1666819691716-827f78d892f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const MEDITATION_IMG = 'https://images.unsplash.com/photo-1635545999375-057ee4013deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const PROFILE_IMG = 'https://images.unsplash.com/photo-1723189038268-3ef8fd518ad9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200';

interface Post {
  id: number;
  user: string;
  avatar: string;
  time: string;
  type: 'workout' | 'food' | 'milestone' | 'wellness';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
  stats?: { label: string; value: string }[];
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/40?img=5',
    time: '15 min ago',
    type: 'workout',
    content: '🏃 Just crushed a 10K run! New personal best: 48:32 min. The morning sun was perfect. Who else runs in the morning? 🌅',
    image: RUNNING_IMG,
    likes: 24,
    comments: 8,
    liked: false,
    stats: [{ label: 'Distance', value: '10 km' }, { label: 'Time', value: '48:32' }, { label: 'Pace', value: '4:51/km' }],
  },
  {
    id: 2,
    user: 'Marcus Williams',
    avatar: 'https://i.pravatar.cc/40?img=12',
    time: '1 hour ago',
    type: 'food',
    content: '🥗 Meal prepped for the whole week! 7 healthy bowls ready to go. Swipe for the recipe breakdown — AIOS suggested this based on my macros! 👏',
    image: FOOD_IMG,
    likes: 47,
    comments: 15,
    liked: true,
    stats: [{ label: 'Calories', value: '450 kcal' }, { label: 'Protein', value: '35g' }, { label: 'Prep Time', value: '45 min' }],
  },
  {
    id: 3,
    user: 'Emma Rivera',
    avatar: 'https://i.pravatar.cc/40?img=9',
    time: '2 hours ago',
    type: 'milestone',
    content: '🎉 30-day meditation streak COMPLETE! AIOS helped me build this habit. Honestly couldn\'t have done it without the daily reminders. My stress levels are down 40%! 🧘',
    image: MEDITATION_IMG,
    likes: 89,
    comments: 23,
    liked: false,
    stats: [{ label: 'Streak', value: '30 days' }, { label: 'Minutes', value: '450 min' }, { label: 'Stress ↓', value: '40%' }],
  },
  {
    id: 4,
    user: 'Jake Torres',
    avatar: 'https://i.pravatar.cc/40?img=15',
    time: '3 hours ago',
    type: 'workout',
    content: '💪 Upper body day complete. 4 sets of bench press at 185lbs — new PR! Thanks for the AIOS workout suggestion, it was perfectly timed for my recovery. 🔥',
    image: FITNESS_IMG,
    likes: 31,
    comments: 12,
    liked: false,
    stats: [{ label: 'Duration', value: '55 min' }, { label: 'Calories', value: '380 kcal' }, { label: 'Exercises', value: '8' }],
  },
];

const leaderboard = [
  { rank: 1, name: 'Emma Rivera', avatar: 'https://i.pravatar.cc/40?img=9', steps: 72450, badge: '🥇' },
  { rank: 2, name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=5', steps: 68200, badge: '🥈' },
  { rank: 3, name: 'Marcus Williams', avatar: 'https://i.pravatar.cc/40?img=12', steps: 64100, badge: '🥉' },
  { rank: 4, name: 'You (Alex)', avatar: PROFILE_IMG, steps: 63882, badge: '4️⃣', isMe: true },
  { rank: 5, name: 'Jake Torres', avatar: 'https://i.pravatar.cc/40?img=15', steps: 58300, badge: '5️⃣' },
  { rank: 6, name: 'Priya Patel', avatar: 'https://i.pravatar.cc/40?img=20', steps: 54100, badge: '6️⃣' },
];

const challenges = [
  { id: 1, name: '10K Steps Daily', emoji: '👟', participants: 234, daysLeft: 12, progress: 78, color: '#14B8A6', joined: true },
  { id: 2, name: '30-Day Yoga', emoji: '🧘', participants: 156, daysLeft: 18, progress: 40, color: '#C77DFF', joined: false },
  { id: 3, name: 'No Sugar Week', emoji: '🚫🍬', participants: 89, daysLeft: 4, progress: 57, color: '#F97316', joined: true },
  { id: 4, name: '5km Run Club', emoji: '🏃', participants: 312, daysLeft: 25, progress: 20, color: '#2563EB', joined: false },
];

const suggestions = [
  { name: 'Priya Patel', mutual: 5, activity: 'Runner · Yoga', avatar: 'https://i.pravatar.cc/40?img=20' },
  { name: 'David Kim', mutual: 3, activity: 'Cyclist · Nutrition', avatar: 'https://i.pravatar.cc/40?img=25' },
  { name: 'Luna Garcia', mutual: 7, activity: 'Fitness · Meditation', avatar: 'https://i.pravatar.cc/40?img=30' },
];

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  workout: { bg: '#E0F7F3', text: '#0F766E', label: '💪 Workout' },
  food: { bg: '#FFF0E8', text: '#D4693A', label: '🥗 Nutrition' },
  milestone: { bg: '#F3E8FE', text: '#8B4EC4', label: '🏆 Milestone' },
  wellness: { bg: '#E8F3FE', text: '#3A69C4', label: '🧘 Wellness' },
};

export default function Social() {
  const [posts, setPosts] = useState(initialPosts);
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'challenges'>('feed');
  const [joinedChallenges, setJoinedChallenges] = useState(challenges.filter(c => c.joined).map(c => c.id));
  const [newPost, setNewPost] = useState('');
  const [showPostBox, setShowPostBox] = useState(false);

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const submitPost = () => {
    if (!newPost.trim()) return;
    setPosts(prev => [{
      id: Date.now(),
      user: 'You (Alex)',
      avatar: PROFILE_IMG,
      time: 'Just now',
      type: 'wellness',
      content: newPost,
      likes: 0,
      comments: 0,
      liked: false,
    }, ...prev]);
    setNewPost('');
    setShowPostBox(false);
  };

  const toggleChallenge = (id: number) => {
    setJoinedChallenges(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#17202E]">Social</h1>
          <p style={{ fontSize: '13px' }} className="text-[#888]">Connect, share & compete with friends</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-white rounded-xl border border-[#14B8A6]/30 hover:bg-[#E0F7F3] transition-colors">
            <Search size={17} className="text-[#666]" />
          </button>
          <button className="p-2.5 bg-white rounded-xl border border-[#14B8A6]/30 hover:bg-[#E0F7F3] transition-colors">
            <Users size={17} className="text-[#666]" />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Following', value: '48', icon: Users, color: '#14B8A6' },
          { label: 'Rank This Week', value: '#4', icon: Trophy, color: '#F4C430' },
          { label: 'Active Streak', value: '5 days', icon: Flame, color: '#F97316' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#14B8A6]/20 p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + '20' }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700 }} className="text-[#17202E]">{s.value}</p>
              <p style={{ fontSize: '10px' }} className="text-[#888]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['feed', 'leaderboard', 'challenges'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl capitalize transition-all border ${
              activeTab === tab
                ? 'bg-[#17202E] text-white border-[#17202E]'
                : 'bg-white text-[#666] border-[#14B8A6]/30 hover:border-[#14B8A6]'
            }`}
            style={{ fontSize: '13px', fontWeight: activeTab === tab ? 600 : 400 }}
          >
            {tab === 'feed' ? '📱 Feed' : tab === 'leaderboard' ? '🏆 Leaderboard' : '⚡ Challenges'}
          </button>
        ))}
      </div>

      {/* FEED TAB */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {/* Create post */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-4">
            {!showPostBox ? (
              <div className="flex items-center gap-3">
                <ImageWithFallback src={PROFILE_IMG} alt="You" className="w-10 h-10 rounded-full object-cover border-2 border-[#14B8A6]" />
                <button
                  onClick={() => setShowPostBox(true)}
                  className="flex-1 text-left px-4 py-2.5 bg-[#EEF3F8] rounded-xl border border-[#14B8A6]/20 text-[#bbb] hover:border-[#14B8A6] transition-colors"
                  style={{ fontSize: '14px' }}
                >
                  Share your progress, Alex...
                </button>
                <button
                  onClick={() => setShowPostBox(true)}
                  className="w-9 h-9 rounded-xl bg-[#17202E] flex items-center justify-center hover:bg-[#14B8A6] transition-colors group"
                >
                  <Plus size={16} className="text-white group-hover:text-[#17202E]" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ImageWithFallback src={PROFILE_IMG} alt="You" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#17202E]">Alex Johnson</p>
                    <p style={{ fontSize: '11px' }} className="text-[#888]">Sharing with followers</p>
                  </div>
                </div>
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="What did you achieve today? Share your workout, meal, or milestone..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-[#EEF3F8] border border-[#14B8A6]/20 rounded-xl resize-none outline-none focus:border-[#14B8A6] text-[#333] placeholder:text-[#bbb]"
                  style={{ fontSize: '14px' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitPost}
                    disabled={!newPost.trim()}
                    className="flex-1 py-2 bg-[#17202E] text-white rounded-xl hover:bg-[#333] disabled:opacity-40 transition-colors"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    Post
                  </button>
                  <button
                    onClick={() => { setShowPostBox(false); setNewPost(''); }}
                    className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    style={{ fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Posts */}
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-[#14B8A6]/20 overflow-hidden">
              {/* Post header */}
              <div className="p-4 flex items-center gap-3">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#17202E]">{post.user}</p>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        backgroundColor: typeColors[post.type].bg,
                        color: typeColors[post.type].text,
                      }}
                      className="rounded-md px-1.5 py-0.5"
                    >
                      {typeColors[post.type].label}
                    </span>
                    <span style={{ fontSize: '11px' }} className="text-[#bbb]">{post.time}</span>
                  </div>
                </div>
              </div>

              {/* Post image */}
              {post.image && (
                <ImageWithFallback src={post.image} alt="Post" className="w-full h-48 object-cover" />
              )}

              {/* Post content */}
              <div className="px-4 pt-3">
                <p style={{ fontSize: '14px', lineHeight: '1.6' }} className="text-[#333]">{post.content}</p>
              </div>

              {/* Stats */}
              {post.stats && (
                <div className="mx-4 mt-3 p-3 bg-[#EEF3F8] rounded-xl flex gap-4">
                  {post.stats.map((s, i) => (
                    <div key={i} className="text-center flex-1">
                      <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#17202E]">{s.value}</p>
                      <p style={{ fontSize: '10px' }} className="text-[#888]">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="p-4 flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-all hover:scale-105 ${post.liked ? 'text-red-500' : 'text-[#888] hover:text-red-400'}`}
                >
                  <Heart size={18} className={post.liked ? 'fill-red-500' : ''} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[#888] hover:text-[#555] transition-colors">
                  <MessageCircle size={18} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[#888] hover:text-[#555] transition-colors">
                  <Share2 size={18} />
                  <span style={{ fontSize: '13px' }}>Share</span>
                </button>
                <button className="ml-auto text-[#bbb] hover:text-[#888] transition-colors">
                  <ThumbsUp size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-[#17202E] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-white">Weekly Step Count</h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg">
                <Footprints size={12} className="text-[#14B8A6]" />
                <span style={{ fontSize: '11px' }} className="text-[#14B8A6]">Apr 1–7</span>
              </div>
            </div>
            {leaderboard.map(person => (
              <div
                key={person.rank}
                className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-all ${person.isMe ? 'bg-[#14B8A6]/15 border border-[#14B8A6]/30' : 'hover:bg-white/5'}`}
              >
                <span style={{ fontSize: '18px' }} className="w-8 text-center">{person.badge}</span>
                <img src={person.avatar} alt={person.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: person.isMe ? 700 : 500 }} className={person.isMe ? 'text-[#14B8A6]' : 'text-white'}>
                    {person.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(person.steps / 72450) * 100}%`,
                          backgroundColor: person.isMe ? '#14B8A6' : 'rgba(255,255,255,0.3)'
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700 }} className={person.isMe ? 'text-[#14B8A6]' : 'text-white/70'}>
                  {person.steps.toLocaleString()}
                </p>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10 text-center">
              <p style={{ fontSize: '12px' }} className="text-white/40">You're <span className="text-[#14B8A6]">568 steps</span> behind #3 · Keep going! 🔥</p>
            </div>
          </div>

          {/* Friend Suggestions */}
          <div className="bg-white rounded-2xl border border-[#14B8A6]/20 p-5">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E] mb-3">Suggested Friends</h3>
            <div className="space-y-3">
              {suggestions.map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#17202E]">{s.name}</p>
                    <p style={{ fontSize: '11px' }} className="text-[#888]">{s.mutual} mutual friends · {s.activity}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E0F7F3] border border-[#14B8A6]/30 text-[#0F766E] rounded-lg hover:bg-[#14B8A6] hover:text-[#222] transition-all" style={{ fontSize: '12px', fontWeight: 600 }}>
                    <UserPlus size={12} /> Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CHALLENGES TAB */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">Active Challenges</h3>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#17202E] text-white rounded-xl hover:bg-[#333] transition-colors" style={{ fontSize: '12px', fontWeight: 600 }}>
              <Plus size={13} /> Create
            </button>
          </div>

          {challenges.map(c => {
            const joined = joinedChallenges.includes(c.id);
            return (
              <div key={c.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${joined ? 'border-[#14B8A6]' : 'border-[#14B8A6]/20'}`}>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">{c.name}</p>
                        {joined && (
                          <span style={{ fontSize: '10px', fontWeight: 600 }} className="px-2 py-0.5 bg-[#E0F7F3] text-[#0F766E] rounded-md">Joined ✓</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Users size={11} className="text-[#888]" />
                          <span style={{ fontSize: '11px' }} className="text-[#888]">{c.participants} participants</span>
                        </div>
                        <span style={{ fontSize: '11px' }} className="text-[#F97316] font-semibold">⏰ {c.daysLeft} days left</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: '11px' }} className="text-[#888]">Your progress</span>
                      <span style={{ fontSize: '11px', fontWeight: 600 }} className="text-[#333]">{c.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                  <button
                    onClick={() => toggleChallenge(c.id)}
                    className={`w-full py-2 rounded-xl transition-all ${joined ? 'bg-[#E0F7F3] text-[#0F766E] border border-[#14B8A6]' : 'bg-[#17202E] text-white hover:bg-[#333]'}`}
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    {joined ? '✓ Joined Challenge' : 'Join Challenge'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
