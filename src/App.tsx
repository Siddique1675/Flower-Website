import React, { useState, useEffect } from "react";
import { 
  Flower, 
  Sparkles, 
  Leaf, 
  Droplets, 
  Sun, 
  Sprout, 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Bookmark, 
  ArrowLeft, 
  Search, 
  Compass, 
  Skull, 
  Maximize2, 
  Minimize2, 
  Send,
  HelpCircle,
  Clock,
  User,
  Calendar,
  Check,
  AlertTriangle,
  Flame,
  Music,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { BlogPost, Comment, FlowerAdvisorResult } from "./types";
import { INITIAL_BLOG_POSTS } from "./data";

// Import our beautiful hero banner directly
import heroBannerImg from "./assets/images/flower_hero_banner_1784286197276.jpg";

export default function App() {
  // State
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem("botanical_posts");
    if (saved) {
      try {
        // Since we import images statically, we map them back if needed
        // But for newly generated AI ones, they use local placeholder visuals
        const parsed = JSON.parse(saved);
        // Merge with initial so that they get the correct static images
        return parsed.map((p: any) => {
          const matchedInitial = INITIAL_BLOG_POSTS.find(i => i.id === p.id);
          return matchedInitial ? { ...matchedInitial, comments: p.comments, likes: p.likes } : p;
        });
      } catch (e) {
        return INITIAL_BLOG_POSTS;
      }
    }
    return INITIAL_BLOG_POSTS;
  });

  const [activeTab, setActiveTab] = useState<"journal" | "grow" | "advisor">("journal");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem("botanical_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Immersive reading settings
  const [sereneMode, setSereneMode] = useState(false);
  const [sereneTextSize, setSereneTextSize] = useState<"normal" | "large">("normal");

  // Growing/Creating Flow State
  const [growName, setGrowName] = useState("");
  const [growTone, setGrowTone] = useState("Poetic & Mystical");
  const [growFocus, setGrowFocus] = useState("General Lore & Symbolism");
  const [isGrowing, setIsGrowing] = useState(false);
  const [growingStep, setGrowingStep] = useState(0);
  const [growError, setGrowError] = useState("");

  // Advisor Advisor State
  const [advisorName, setAdvisorName] = useState("");
  const [advisorQuery, setAdvisorQuery] = useState("");
  const [advisorResult, setAdvisorResult] = useState<FlowerAdvisorResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [advisorError, setAdvisorError] = useState("");

  // New Comment state
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌸");

  // Growing quotes for ambient loading screen
  const growingQuotes = [
    "Sowing a seed of pure imagination...",
    "Calibrating solar energy and chlorophyll levels...",
    "Weaving cultural folklore and historical memories...",
    "Watering the botanical narrative with deep lore...",
    "Awakening the petals in a cascade of colors...",
    "Perfecting the fragrance and final poetic stanzas..."
  ];

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("botanical_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("botanical_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Loading animation cycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGrowing) {
      interval = setInterval(() => {
        setGrowingStep((prev) => (prev + 1) % growingQuotes.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGrowing]);

  // Tag extraction
  const allTags = ["All", ...Array.from(new Set(posts.flatMap(p => p.tags)))];

  // Handlers
  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleToggleBookmark = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: "comment_" + Date.now(),
      author: commentAuthor,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(commentAuthor)}`,
      text: `${selectedEmoji} ${commentText}`,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updated = { ...p, comments: [newComment, ...p.comments] };
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(updated);
        }
        return updated;
      }
      return p;
    }));

    setCommentText("");
    setCommentAuthor("");
  };

  // Grow Custom Flower Post via Gemini
  const handleGrowFlower = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!growName.trim()) return;

    setIsGrowing(true);
    setGrowingStep(0);
    setGrowError("");

    try {
      const response = await fetch("/api/gemini/write-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowerName: growName,
          tone: growTone,
          focus: growFocus
        })
      });

      if (!response.ok) {
        throw new Error("Garden server failed to bloom this flower. Please check credentials.");
      }

      const data = await response.json();
      
      const newPost: BlogPost = {
        id: "ai_" + Date.now(),
        title: data.title || `The Secrets of the ${growName}`,
        subtitle: data.subtitle || "A beautifully harvested AI creation",
        author: data.author || "The Artificial Herbalist",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readTime: data.readTime || "4 min read",
        // Fallback placeholder with stunning SVG gradient based on flower's aesthetic color
        image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><radialGradient id="grad" cx="50%" cy="50%" r="75%"><stop offset="0%" style="stop-color:${encodeURIComponent(data.aestheticColor || "#EC4899")};stop-opacity:1"/><stop offset="100%" style="stop-color:%230F172A;stop-opacity:1"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23grad)"/><circle cx="400" cy="300" r="180" fill="none" stroke="white" stroke-width="2" stroke-opacity="0.15"/><circle cx="400" cy="300" r="120" fill="none" stroke="white" stroke-width="1.5" stroke-opacity="0.25"/><circle cx="400" cy="300" r="60" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.35"/><path d="M400,200 Q450,250 400,300 Q350,250 400,200" fill="white" fill-opacity="0.1"/><path d="M400,300 Q450,350 400,400 Q350,350 400,300" fill="white" fill-opacity="0.1"/><path d="M300,300 Q350,350 400,300 Q350,250 300,300" fill="white" fill-opacity="0.1"/><path d="M400,300 Q450,250 500,300 Q450,350 400,300" fill="white" fill-opacity="0.1"/><text x="400" y="550" font-family="Georgia" font-size="24" fill="white" text-anchor="middle" letter-spacing="4">${encodeURIComponent(growName.toUpperCase())}</text></svg>`,
        tags: data.tags || ["botanical", "ai-bloom"],
        aestheticColor: data.aestheticColor || "#10B981",
        likes: 12,
        comments: [],
        content: data.content,
        careWatering: data.careWatering,
        careLight: data.careLight,
        careSoil: data.careSoil,
        isAiGenerated: true
      };

      setPosts(prev => [newPost, ...prev]);
      setGrowName("");
      // Transition to showing the post
      setSelectedPost(newPost);
      setActiveTab("journal");
    } catch (err: any) {
      setGrowError(err.message || "Something went wrong in the nursery.");
    } finally {
      setIsGrowing(false);
    }
  };

  // Consult care advisor via Gemini
  const handleConsultAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorName.trim()) return;

    setIsAnalyzing(true);
    setAdvisorError("");
    setAdvisorResult(null);

    try {
      const response = await fetch("/api/gemini/analyze-flower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowerName: advisorName,
          userQuestion: advisorQuery
        })
      });

      if (!response.ok) {
        throw new Error("The conservatory archive is temporarily inaccessible.");
      }

      const data = await response.json();
      setAdvisorResult(data);
    } catch (err: any) {
      setAdvisorError(err.message || "Failed to retrieve botanical advice.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Editorial Top Navigation */}
      <header className="border-b border-neutral-200/60 sticky top-0 bg-[#FAF8F5]/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Title */}
          <div 
            onClick={() => { setSelectedPost(null); setActiveTab("journal"); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:rotate-12 transition-transform duration-500">
              <Flower className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <span className="font-serif text-xl font-semibold tracking-wide text-neutral-900">Flower Blog</span>
              <span className="block text-[10px] uppercase tracking-widest text-emerald-800 font-medium">Botanical Science & AI Lore</span>
            </div>
          </div>

          {/* Core Navigation Links */}
          <nav className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => { setSelectedPost(null); setActiveTab("journal"); }}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === "journal" 
                  ? "bg-emerald-950 text-white shadow-sm" 
                  : "hover:bg-neutral-100 text-neutral-600"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Botanical Journal</span>
            </button>
            
            <button
              onClick={() => { setSelectedPost(null); setActiveTab("grow"); }}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === "grow" 
                  ? "bg-emerald-950 text-white shadow-sm" 
                  : "hover:bg-neutral-100 text-neutral-600"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>AI Garden Lab</span>
            </button>

            <button
              onClick={() => { setSelectedPost(null); setActiveTab("advisor"); }}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === "advisor" 
                  ? "bg-emerald-950 text-white shadow-sm" 
                  : "hover:bg-neutral-100 text-neutral-600"
              }`}
            >
              <Sprout className="w-4 h-4 text-amber-500" />
              <span>Care Advisor</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        <AnimatePresence mode="wait">
          
          {/* 1. BLOG POST DETAIL VIEW */}
          {selectedPost ? (
            <motion.article
              key="post-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              {/* Back Button */}
              <button 
                onClick={() => setSelectedPost(null)}
                className="mb-8 group flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Journal</span>
              </button>

              {/* Immersive Controls Bar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 py-3 border-y border-neutral-200/50">
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Written by {selectedPost.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedPost.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedPost.readTime}</span>
                  </span>
                  {selectedPost.isAiGenerated && (
                    <>
                      <span>•</span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-mono text-[10px] tracking-wider border border-emerald-100 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                        AI Cultivated
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Serene Mode Toggle */}
                  <button 
                    onClick={() => setSereneMode(!sereneMode)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                      sereneMode 
                        ? "bg-amber-50 border-amber-200 text-amber-900" 
                        : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                    title="Toggle Editorial Reading Mode"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>{sereneMode ? "Serene Mode Active" : "Serene Reading Mode"}</span>
                  </button>

                  {sereneMode && (
                    <button
                      onClick={() => setSereneTextSize(prev => prev === "normal" ? "large" : "normal")}
                      className="px-2 py-1 rounded border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-900 text-[10px] font-mono"
                    >
                      AA
                    </button>
                  )}
                </div>
              </div>

              {/* Layout Grid: Content + Botanical Specs Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Column: Markdown Content */}
                <div className={`lg:col-span-8 rounded-3xl overflow-hidden transition-colors duration-500 ${
                  sereneMode 
                    ? "bg-[#FCFBF7] p-8 md:p-12 border border-amber-100/60 shadow-md shadow-amber-900/5" 
                    : "bg-white p-6 md:p-10 border border-neutral-100 shadow-sm"
                }`}>
                  {/* Highlight Banner / Image */}
                  <div className="relative aspect-[16:9] rounded-2xl overflow-hidden mb-8 border border-neutral-200/40">
                    <img 
                      src={selectedPost.image} 
                      alt={selectedPost.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      {selectedPost.tags.map(t => (
                        <span key={t} className="bg-white/90 backdrop-blur-sm text-neutral-800 px-3 py-1 rounded-full text-xs font-medium border border-neutral-100 shadow-sm">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title Area */}
                  <div className="mb-6">
                    <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 leading-tight tracking-tight mb-2">
                      {selectedPost.title}
                    </h1>
                    <p className="font-serif italic text-neutral-500 text-lg md:text-xl">
                      {selectedPost.subtitle}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-16 h-1 bg-emerald-700/80 rounded-full mb-8" />

                  {/* Markdown Body */}
                  <div className={`prose max-w-none ${
                    sereneMode 
                      ? sereneTextSize === "large" ? "text-xl leading-relaxed text-amber-950 font-serif" : "text-lg leading-relaxed text-amber-950 font-serif"
                      : "text-neutral-700 font-sans"
                  }`}>
                    <Markdown components={{
                      h1: ({node, ...props}) => <h2 className="font-serif text-2xl md:text-3xl text-neutral-900 font-semibold mt-8 mb-4 tracking-tight border-b border-neutral-100 pb-2" {...props} />,
                      h2: ({node, ...props}) => <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-medium mt-6 mb-3" {...props} />,
                      p: ({node, ...props}) => <p className="mb-5 leading-relaxed" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-emerald-600/60 bg-emerald-50/20 italic pl-5 py-2 my-6 text-neutral-600 font-serif rounded-r-lg" {...props} />
                      ),
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-5 space-y-1.5" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-5 space-y-1.5" {...props} />,
                      li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-neutral-900" {...props} />,
                    }}>
                      {selectedPost.content}
                    </Markdown>
                  </div>

                  {/* Reactions Area */}
                  <div className="mt-12 pt-8 border-t border-neutral-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => handleLike(selectedPost.id, e)}
                        className="flex items-center gap-2 group px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-500 fill-current group-hover:scale-125 transition-transform" />
                        <span className="font-semibold text-sm">{selectedPost.likes} Loves</span>
                      </button>

                      <button 
                        onClick={(e) => handleToggleBookmark(selectedPost.id, e)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                          bookmarks.includes(selectedPost.id)
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarks.includes(selectedPost.id) ? "fill-current text-emerald-700" : ""}`} />
                        <span className="text-sm">{bookmarks.includes(selectedPost.id) ? "Saved in Garden" : "Bookmark"}</span>
                      </button>
                    </div>

                    <span className="text-xs font-mono text-neutral-400">
                      ID: {selectedPost.id}
                    </span>
                  </div>
                </div>

                {/* Right Column: Dynamic Care Guidelines Card */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Quick Care Blueprint (If present) */}
                  {(selectedPost.careWatering || selectedPost.careLight || selectedPost.careSoil) && (
                    <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#ECE0CE] shadow-sm">
                      <div className="flex items-center gap-2 mb-4 text-[#7A5B35]">
                        <Sprout className="w-5 h-5" />
                        <h3 className="font-serif font-semibold text-base">Nurture & Care Guide</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedPost.careWatering && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-[#F3ECE0] mt-0.5">
                              <Droplets className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div>
                              <span className="block text-xs font-mono font-medium text-[#7A5B35] uppercase">Hydration Plan</span>
                              <p className="text-xs text-neutral-600 leading-relaxed">{selectedPost.careWatering}</p>
                            </div>
                          </div>
                        )}

                        {selectedPost.careLight && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-[#F3ECE0] mt-0.5">
                              <Sun className="w-3.5 h-3.5 text-amber-500" />
                            </div>
                            <div>
                              <span className="block text-xs font-mono font-medium text-[#7A5B35] uppercase">Sunlight Harmony</span>
                              <p className="text-xs text-neutral-600 leading-relaxed">{selectedPost.careLight}</p>
                            </div>
                          </div>
                        )}

                        {selectedPost.careSoil && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-[#F3ECE0] mt-0.5">
                              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div>
                              <span className="block text-xs font-mono font-medium text-[#7A5B35] uppercase">Soil Chemistry</span>
                              <p className="text-xs text-neutral-600 leading-relaxed">{selectedPost.careSoil}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interactive Comments Drawer */}
                  <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-neutral-900">
                      <MessageSquare className="w-4 h-4 text-neutral-500" />
                      <h3 className="font-semibold text-sm">Garden Discussion ({selectedPost.comments.length})</h3>
                    </div>

                    {/* Add Comment Form */}
                    <form onSubmit={(e) => handleAddComment(selectedPost.id, e)} className="mb-6 space-y-3">
                      <div>
                        <input 
                          type="text" 
                          placeholder="Your gardener name..."
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-emerald-700 bg-neutral-50/50"
                          required
                        />
                      </div>
                      
                      <div className="relative">
                        <textarea 
                          placeholder="Share your botanical thoughts..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={3}
                          className="w-full text-xs px-3 py-2 pr-10 rounded-lg border border-neutral-200 focus:outline-none focus:border-emerald-700 bg-neutral-50/50 resize-none"
                          required
                        />
                        <div className="absolute right-2 bottom-3 flex flex-col gap-1 bg-white border border-neutral-100 rounded shadow-sm">
                          <select 
                            value={selectedEmoji} 
                            onChange={(e) => setSelectedEmoji(e.target.value)}
                            className="bg-transparent text-sm border-none outline-none cursor-pointer p-0.5"
                          >
                            <option value="🌸">🌸</option>
                            <option value="🌹">🌹</option>
                            <option value="🌻">🌻</option>
                            <option value="🌿">🌿</option>
                            <option value="🪻">🪻</option>
                            <option value="🍁">🍁</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2 bg-emerald-950 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Sow Thought</span>
                      </button>
                    </form>

                    {/* List of Comments */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {selectedPost.comments.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic text-center py-4">No words spoken yet. Be the first to share.</p>
                      ) : (
                        selectedPost.comments.map(c => (
                          <div key={c.id} className="text-xs border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <img src={c.avatar} alt={c.author} className="w-5 h-5 rounded-full border border-neutral-100" referrerPolicy="no-referrer" />
                              <span className="font-semibold text-neutral-800">{c.author}</span>
                              <span className="text-[10px] text-neutral-400 ml-auto">{c.date}</span>
                            </div>
                            <p className="text-neutral-600 pl-7 leading-relaxed">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </motion.article>
          ) : (
            
            // TABS SWITCHER AREA
            <div key="tabs-content">
              
              {/* 2. THE MAIN JOURNAL / BLOG LISTING */}
              {activeTab === "journal" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  
                  {/* Hero Anthology Showcase */}
                  <div className="bg-[#FAF6F0] rounded-3xl overflow-hidden border border-[#ECE0CE] grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-sm">
                    <div className="p-8 md:p-12 lg:col-span-7 flex flex-col justify-center space-y-6">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-[#7A5B35] uppercase bg-[#F3ECE0] px-3.5 py-1.5 rounded-full self-start border border-[#E1D1BC]">
                        FEATURED ESSAY
                      </span>
                      <h2 className="font-serif text-3xl md:text-5xl text-[#2F2110] leading-tight font-semibold tracking-tight">
                        The Quiet Magic of Botanical Lore
                      </h2>
                      <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-sans max-w-xl">
                        Welcome to our sanctuary. Read expertly cataloged historical essays on your favorite flora, 
                        or venture into the <strong>AI Garden Lab</strong> to grow custom flower species with complete, 
                        procedurally synthesized myths and customized watering guides.
                      </p>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setActiveTab("grow")}
                          className="px-6 py-3 bg-[#7A5B35] hover:bg-[#684C2B] text-white text-sm font-semibold rounded-full flex items-center gap-2 transition-all shadow-md shadow-[#7A5B35]/10"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Grow Custom Flower</span>
                        </button>
                        
                        <button 
                          onClick={() => setSelectedPost(posts[0])}
                          className="px-6 py-3 border border-[#7A5B35]/30 hover:bg-[#F3ECE0]/50 text-[#7A5B35] text-sm font-semibold rounded-full transition-all"
                        >
                          <span>Begin Reading</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-5 relative min-h-[250px] overflow-hidden border-t lg:border-t-0 lg:border-l border-[#ECE0CE]">
                      <img 
                        src={heroBannerImg} 
                        alt="Flora Editorial Flat Lay" 
                        className="w-full h-full object-cover select-none pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-t from-[#FAF6F0]/20 to-transparent" />
                    </div>
                  </div>

                  {/* Filter Search Section */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200/50">
                    
                    {/* Tag Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize tracking-wide transition-all ${
                            selectedTag === tag 
                              ? "bg-emerald-950 text-white shadow-sm" 
                              : "bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                          }`}
                        >
                          {tag === "All" ? "All Blooms" : `#${tag}`}
                        </button>
                      ))}
                    </div>

                    {/* Search Field */}
                    <div className="relative w-full md:w-80">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search the conservatory archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700/50 focus:border-emerald-700 focus:shadow-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Empty State */}
                  {filteredPosts.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100 shadow-sm max-w-lg mx-auto">
                      <HelpCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                      <h4 className="font-serif text-lg text-neutral-900 font-medium mb-1">No botanical matches found</h4>
                      <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-6">
                        No articles match "{searchQuery}" or tag "{selectedTag}". Sown some seeds in the AI Garden Lab to grow a new flower!
                      </p>
                      <button 
                        onClick={() => setActiveTab("grow")}
                        className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white rounded-full text-xs font-semibold"
                      >
                        Go to Garden Lab
                      </button>
                    </div>
                  )}

                  {/* Blog Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        layout
                        onClick={() => setSelectedPost(post)}
                        className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-xs hover:shadow-md hover:border-neutral-200/60 transition-all duration-300 cursor-pointer group flex flex-col"
                      >
                        {/* Post Image with Hover Zoom */}
                        <div className="aspect-[4:3] overflow-hidden relative bg-neutral-50 border-b border-neutral-100">
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Aesthetic Color Ring Indicator */}
                          <div 
                            className="absolute bottom-4 right-4 w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px]"
                            style={{ backgroundColor: post.aestheticColor }}
                            title="Floral Palette Vibe"
                          >
                            <span className="text-white font-mono opacity-80">✿</span>
                          </div>

                          {/* AI Badge */}
                          {post.isAiGenerated && (
                            <span className="absolute top-4 left-4 bg-emerald-950/90 text-white px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase border border-white/15 backdrop-blur-xs flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                              AI Generated
                            </span>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex-1 flex flex-col space-y-4">
                          <div className="space-y-2">
                            {/* Author & Date metadata */}
                            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                              <span>BY {post.author.toUpperCase()}</span>
                              <span>•</span>
                              <span>{post.date.toUpperCase()}</span>
                            </div>

                            {/* Title */}
                            <h3 className="font-serif text-lg text-neutral-900 group-hover:text-emerald-800 leading-snug tracking-tight font-semibold transition-colors duration-200">
                              {post.title}
                            </h3>

                            {/* Subtitle / Excerpt */}
                            <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                              {post.subtitle}
                            </p>
                          </div>

                          {/* Tags Pills list */}
                          <div className="flex flex-wrap gap-1 mt-auto">
                            {post.tags.map(t => (
                              <span key={t} className="bg-neutral-50 text-neutral-500 px-2 py-0.5 rounded text-[10px] border border-neutral-100">
                                #{t}
                              </span>
                            ))}
                          </div>

                          {/* Footer details */}
                          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                            <span className="flex items-center gap-1 text-[11px] font-mono">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              {post.readTime}
                            </span>
                            <div className="flex items-center gap-3">
                              <span 
                                onClick={(e) => { handleLike(post.id, e); }}
                                className="flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Heart className="w-3.5 h-3.5 text-rose-500 hover:fill-current" />
                                {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                                {post.comments.length}
                              </span>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              )}

              {/* 3. AI GARDEN LAB (WRITE CUSTOM BLOG) */}
              {activeTab === "grow" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="text-center space-y-3 mb-10">
                    <span className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 mx-auto">
                      <Sparkles className="w-6 h-6 text-emerald-700" />
                    </span>
                    <h2 className="font-serif text-3xl font-semibold tracking-tight text-neutral-900">
                      The AI Garden Laboratory
                    </h2>
                    <p className="text-sm text-neutral-500 max-w-md mx-auto">
                      Harness the server-side intelligence of Gemini to craft a beautiful, poetic, or scientific botanical monograph about any flower you imagine.
                    </p>
                  </div>

                  {/* Seed growing animation modal backdrop */}
                  {isGrowing ? (
                    <div className="bg-white rounded-3xl p-10 border border-neutral-100 shadow-md text-center space-y-8 py-16">
                      
                      {/* Animated Sprout Canvas */}
                      <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 bg-emerald-50 rounded-full animate-ping opacity-25" />
                        <div className="absolute inset-4 bg-emerald-100/50 rounded-full animate-pulse" />
                        
                        <div className="relative flex flex-col items-center">
                          <Sprout className="w-16 h-16 text-emerald-700 animate-bounce" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-serif text-xl font-medium text-emerald-900">
                          Cultivating Your Bloom
                        </h4>
                        
                        {/* Dynamic Step Text */}
                        <p className="text-xs text-neutral-500 italic h-6 animate-pulse">
                          {growingQuotes[growingStep]}
                        </p>
                      </div>

                      {/* Small mock progress indicator */}
                      <div className="w-64 bg-neutral-100 h-1 rounded-full mx-auto overflow-hidden">
                        <div 
                          className="bg-emerald-700 h-full transition-all duration-[3500ms]"
                          style={{ width: `${((growingStep + 1) / growingQuotes.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
                      
                      {/* Form Details */}
                      <form onSubmit={handleGrowFlower} className="p-8 md:col-span-7 space-y-6">
                        <h3 className="font-serif text-xl font-semibold text-neutral-900 pb-3 border-b border-neutral-100">
                          Plant a New Seed
                        </h3>

                        {growError && (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{growError}</span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                            Name of the Flower
                          </label>
                          <input 
                            type="text"
                            placeholder="e.g., Starlight Dahlia, Ghost Orchid, Red Lotus"
                            value={growName}
                            onChange={(e) => setGrowName(e.target.value)}
                            required
                            className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/50 bg-neutral-50/50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                              Artistic Tone
                            </label>
                            <select
                              value={growTone}
                              onChange={(e) => setGrowTone(e.target.value)}
                              className="w-full px-3 py-3 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-emerald-700"
                            >
                              <option value="Poetic & Mystical">Poetic & Mystical</option>
                              <option value="Scientific & Historical">Scientific & Historical</option>
                              <option value="Cozy & Storyteller">Cozy & Storyteller</option>
                              <option value="Gothic & Dark Victorian">Gothic & Dark Victorian</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                              Monograph Focus
                            </label>
                            <select
                              value={growFocus}
                              onChange={(e) => setGrowFocus(e.target.value)}
                              className="w-full px-3 py-3 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-emerald-700"
                            >
                              <option value="General Lore & Symbolism">General Lore & Symbolism</option>
                              <option value="Gardening & Care blueprint">Gardening & Care blueprint</option>
                              <option value="Ancient Mythology & Magic">Ancient Mythology & Magic</option>
                            </select>
                          </div>

                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>Grow Custom Monograph</span>
                        </button>
                      </form>

                      {/* Right side Info Card */}
                      <div className="bg-[#FAF6F0] p-8 md:col-span-5 border-t md:border-t-0 md:border-l border-neutral-100 flex flex-col justify-between space-y-6">
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-[#7A5B35] uppercase bg-[#F3ECE0] px-2.5 py-1 rounded">
                            BOTANIST PROTOCOL
                          </span>
                          <h4 className="font-serif text-lg text-[#2F2110] font-semibold mt-3 mb-2">
                            How the Lab Grows
                          </h4>
                          <p className="text-xs text-neutral-500 leading-relaxed space-y-2">
                            Our AI garden leverages Gemini to generate genuine botanical care instructions (soil type, sunlight needs, watering intervals), pair it with cultural meanings, and formulate custom prose in exquisite markdown styles.
                          </p>
                        </div>

                        <div className="p-4 bg-white/60 border border-[#ECE0CE] rounded-2xl">
                          <span className="block text-[10px] font-mono font-bold text-[#7A5B35] uppercase mb-1">
                            Suggested Varieties
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {["Lunar Moonflower", "Gilded Dandelion", "Storm Petal Orchid"].map(v => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setGrowName(v)}
                                className="px-2 py-1 rounded bg-[#F3ECE0] text-[#7A5B35] hover:bg-[#EBDCC5] text-[10px] font-medium transition-colors"
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </motion.div>
              )}

              {/* 4. BOTANICAL CARE ADVISOR */}
              {activeTab === "advisor" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  <div className="text-center space-y-3 mb-4">
                    <span className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 mx-auto">
                      <Compass className="w-6 h-6 text-amber-700" />
                    </span>
                    <h2 className="font-serif text-3xl font-semibold tracking-tight text-neutral-900">
                      The Botanical Consultation Desk
                    </h2>
                    <p className="text-sm text-neutral-500 max-w-md mx-auto">
                      Ask any question regarding real-world gardening, sick leaves, companion pairings, or pet toxicity details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Advice request form */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm md:col-span-5 space-y-6">
                      <h3 className="font-serif text-lg font-semibold text-neutral-900 pb-3 border-b border-neutral-100">
                        Ask an Expert
                      </h3>

                      {advisorError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{advisorError}</span>
                        </div>
                      )}

                      <form onSubmit={handleConsultAdvisor} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                            Flower / Plant Name
                          </label>
                          <input 
                            type="text"
                            placeholder="e.g. Hydrangea, Peace Lily, Monstera"
                            value={advisorName}
                            onChange={(e) => setAdvisorName(e.target.value)}
                            required
                            className="w-full text-xs px-3.5 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-emerald-700 bg-neutral-50/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                            Your Garden Question
                          </label>
                          <textarea 
                            placeholder="e.g. Why are the edges of my leaves turning yellow, and what soil mix does it thrive in?"
                            value={advisorQuery}
                            onChange={(e) => setAdvisorQuery(e.target.value)}
                            rows={4}
                            className="w-full text-xs px-3.5 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-emerald-700 bg-neutral-50/50 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isAnalyzing}
                          className="w-full py-3 bg-amber-950 hover:bg-amber-900 disabled:bg-neutral-300 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {isAnalyzing ? (
                            <>
                              <Sprout className="w-4 h-4 animate-spin text-amber-200" />
                              <span>Consulting botanical archives...</span>
                            </>
                          ) : (
                            <>
                              <Compass className="w-4 h-4 text-amber-400" />
                              <span>Request Advice</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Results panel */}
                    <div className="md:col-span-7">
                      <AnimatePresence mode="wait">
                        {advisorResult ? (
                          <motion.div
                            key="advisor-result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#FAF6F0] rounded-3xl border border-[#ECE0CE] p-6 space-y-6"
                          >
                            {/* Header details */}
                            <div className="border-b border-[#ECE0CE] pb-4 flex justify-between items-start">
                              <div>
                                <h3 className="font-serif text-2xl font-bold text-[#2F2110] capitalize">{advisorName}</h3>
                                <span className="font-mono text-xs italic text-[#7A5B35]">
                                  {advisorResult.botanicalName} ({advisorResult.family})
                                </span>
                              </div>
                              <span className="text-[9px] font-mono bg-[#EBDCC5] text-[#7A5B35] px-2.5 py-1 rounded uppercase tracking-widest font-bold">
                                BOTANICAL ADVICE
                              </span>
                            </div>

                            {/* Symbolism & Habitat details */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div className="p-3.5 bg-white/60 border border-[#ECE0CE] rounded-xl">
                                <span className="block text-[10px] font-mono text-[#7A5B35] uppercase font-bold mb-0.5">Native Habitat</span>
                                <span className="text-[#2F2110]">{advisorResult.nativeRegion}</span>
                              </div>
                              <div className="p-3.5 bg-white/60 border border-[#ECE0CE] rounded-xl">
                                <span className="block text-[10px] font-mono text-[#7A5B35] uppercase font-bold mb-0.5">Floriography Symbolism</span>
                                <span className="text-[#2F2110]">{advisorResult.symbolicMeaning}</span>
                              </div>
                            </div>

                            {/* Seasonal Schedule Calendar */}
                            <div className="space-y-2">
                              <h4 className="font-serif text-sm font-semibold text-[#2F2110] flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-[#7A5B35]" />
                                <span>Seasonal Care Blueprint</span>
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-3 bg-white/30 rounded-lg">
                                  <span className="font-semibold text-emerald-800">🌱 Spring</span>
                                  <p className="text-neutral-600 text-[11px] mt-0.5 leading-snug">{advisorResult.seasonalCare.spring}</p>
                                </div>
                                <div className="p-3 bg-white/30 rounded-lg">
                                  <span className="font-semibold text-amber-700">☀️ Summer</span>
                                  <p className="text-neutral-600 text-[11px] mt-0.5 leading-snug">{advisorResult.seasonalCare.summer}</p>
                                </div>
                                <div className="p-3 bg-white/30 rounded-lg">
                                  <span className="font-semibold text-orange-700">🍂 Autumn</span>
                                  <p className="text-neutral-600 text-[11px] mt-0.5 leading-snug">{advisorResult.seasonalCare.autumn}</p>
                                </div>
                                <div className="p-3 bg-white/30 rounded-lg">
                                  <span className="font-semibold text-blue-800">❄️ Winter</span>
                                  <p className="text-neutral-600 text-[11px] mt-0.5 leading-snug">{advisorResult.seasonalCare.winter}</p>
                                </div>
                              </div>
                            </div>

                            {/* Companions & Toxicity Specs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1.5">
                                <h5 className="font-serif font-semibold text-[#2F2110]">Ideal Companions</h5>
                                <div className="flex gap-1.5 flex-wrap">
                                  {advisorResult.companionPlants.map(c => (
                                    <span key={c} className="bg-[#F3ECE0] border border-[#E1D1BC] px-2 py-0.5 rounded text-[10px] text-[#7A5B35] font-medium">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <h5 className="font-serif font-semibold text-[#2F2110] flex items-center gap-1">
                                  <Skull className="w-3.5 h-3.5 text-[#7A5B35]" />
                                  <span>Toxicity & Pet Safety</span>
                                </h5>
                                <p className="text-[11px] text-neutral-600 leading-snug">{advisorResult.toxicToPets}</p>
                              </div>
                            </div>

                            {/* Expert botanical quote */}
                            <div className="p-4 bg-white/80 border border-[#ECE0CE] rounded-2xl italic text-xs text-neutral-600 leading-relaxed relative">
                              <span className="absolute -top-3 left-4 bg-white px-2.5 py-0.5 rounded-full border border-neutral-100 text-[10px] font-mono text-[#7A5B35] font-bold uppercase">
                                Gardener's Note
                              </span>
                              <p className="pt-1">"{advisorResult.expertAdvice}"</p>
                            </div>

                          </motion.div>
                        ) : (
                          <div className="bg-white rounded-3xl border border-neutral-100 p-8 text-center py-16 text-neutral-400 space-y-4">
                            <Compass className="w-10 h-10 text-neutral-200 mx-auto" />
                            <div className="space-y-1.5">
                              <h4 className="font-serif text-base text-neutral-900 font-medium">No active consultation</h4>
                              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                                Type a plant name and your query in the advisor panel to load expert advice and structured care certificates dynamically.
                              </p>
                            </div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                </motion.div>
              )}

            </div>
          )}

        </AnimatePresence>

      </main>

      {/* Aesthetic Footer */}
      <footer className="border-t border-neutral-200/50 mt-20 py-12 bg-white text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neutral-700">
              <Flower className="w-4 h-4 text-emerald-700" />
              <span className="font-serif font-semibold">Flower Blog</span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-xs">
              A high-concept botanical anthology exploring floral floriography, historical lore, and expert care recommendations through curated digital publication.
            </p>
          </div>

          <div className="space-y-2">
            <span className="block text-[10px] font-mono font-bold tracking-wider text-neutral-600 uppercase">Interactive Nursery</span>
            <ul className="space-y-1 text-[11px]">
              <li><button onClick={() => { setSelectedPost(null); setActiveTab("journal"); }} className="hover:text-emerald-700 transition-colors">Botanical Journal Feed</button></li>
              <li><button onClick={() => { setSelectedPost(null); setActiveTab("grow"); }} className="hover:text-emerald-700 transition-colors">AI Garden Laboratory</button></li>
              <li><button onClick={() => { setSelectedPost(null); setActiveTab("advisor"); }} className="hover:text-emerald-700 transition-colors">Conservatory Consultant</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="block text-[10px] font-mono font-bold tracking-wider text-neutral-600 uppercase">Botanical Philosophy</span>
            <p className="text-[11px] leading-relaxed italic">
              "To plant a garden is to believe in tomorrow." <br />— Audrey Hepburn
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-neutral-100 flex items-center justify-between text-[10px]">
          <span>© 2026 Flower Blog Conservatory. All rights reserved.</span>
          <span className="font-mono text-neutral-300">UTILITY PORT: 3000</span>
        </div>
      </footer>

    </div>
  );
}
