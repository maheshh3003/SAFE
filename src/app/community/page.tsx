'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  ChatBubbleLeftIcon,
  HeartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ClockIcon,
  HandThumbUpIcon,
  ChatBubbleOvalLeftIcon,
  ShieldCheckIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Navigation from '@/components/Navigation'

interface Post {
  id: string
  title: string
  content: string
  author: string
  authorInitials: string
  category: string
  timestamp: string
  likes: number
  replies: number
  isLiked: boolean
  isAnonymous: boolean
  tags: string[]
}

const posts: Post[] = [
  {
    id: '1',
    title: 'Starting therapy for the first time',
    content: 'I\'ve been thinking about starting therapy but I\'m nervous about the process. Has anyone here had a positive first experience they could share? What should I expect?',
    author: 'Anonymous',
    authorInitials: 'A',
    category: 'Therapy',
    timestamp: '2 hours ago',
    likes: 12,
    replies: 8,
    isLiked: false,
    isAnonymous: true,
    tags: ['first-time', 'therapy', 'anxiety']
  },
  {
    id: '2',
    title: 'Mindfulness practice helped me today',
    content: 'Had a really tough morning but took 10 minutes to do some breathing exercises. Amazing how much it helped center me. Sharing some hope for anyone having a difficult day.',
    author: 'Sarah M.',
    authorInitials: 'SM',
    category: 'Mindfulness',
    timestamp: '4 hours ago',
    likes: 24,
    replies: 6,
    isLiked: true,
    isAnonymous: false,
    tags: ['mindfulness', 'success', 'breathing']
  },
  {
    id: '3',
    title: 'Supporting a friend through depression',
    content: 'My close friend has been struggling with depression and I want to be there for them. What are some ways I can offer support without overstepping boundaries?',
    author: 'Anonymous',
    authorInitials: 'A',
    category: 'Support',
    timestamp: '6 hours ago',
    likes: 18,
    replies: 12,
    isLiked: false,
    isAnonymous: true,
    tags: ['friendship', 'depression', 'support']
  },
  {
    id: '4',
    title: 'Celebrating small wins',
    content: 'Got out of bed, took a shower, and made breakfast this morning. Might seem small but it\'s been hard lately. Celebrating the little victories!',
    author: 'Alex R.',
    authorInitials: 'AR',
    category: 'Progress',
    timestamp: '1 day ago',
    likes: 45,
    replies: 15,
    isLiked: true,
    isAnonymous: false,
    tags: ['progress', 'self-care', 'victory']
  }
]

const categories = ['All', 'Therapy', 'Mindfulness', 'Support', 'Progress', 'Anxiety', 'Depression']

const communityGuidelines = [
  'Be respectful and kind to all members',
  'Respect privacy and confidentiality', 
  'No medical advice - seek professional help',
  'Use content warnings for sensitive topics',
  'Report inappropriate content to moderators'
]

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set(['2', '4']))

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts)
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 pb-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-soft border border-sage-200/30 text-sage-700 mb-4">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Safe Community Space</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-plus-jakarta font-bold text-sage-800 mb-6">
              Peer Support Community
            </h1>
            
            <p className="text-xl text-sage-600 max-w-3xl mx-auto font-dm-sans leading-relaxed">
              Connect with others on similar journeys. Share experiences, find support, 
              and build meaningful connections in a moderated, safe environment.
            </p>
          </motion.div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Active Members', value: '2,847', icon: UserGroupIcon },
              { label: 'Support Posts', value: '1,256', icon: ChatBubbleLeftIcon },
              { label: 'Helpful Responses', value: '8,934', icon: HeartIcon },
              { label: 'Online Now', value: '142', icon: ClockIcon }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-4 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-sage-300 to-sage-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-plus-jakarta font-bold text-sage-800 font-dm-sans">{stat.value}</div>
                <div className="text-sage-600 text-base font-semibold font-dm-sans">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* New Post Button */}
              <motion.button
                className="w-full btn-primary flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="w-5 h-5" />
                <span>New Post</span>
              </motion.button>

              {/* Search */}
              <div className="glass-card rounded-2xl p-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="glass-card rounded-2xl p-4">
                <h3 className="font-plus-jakarta font-semibold text-sage-800 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-300 ${
                        selectedCategory === category
                          ? 'bg-sage-100 text-sage-800 font-medium'
                          : 'text-sage-600 hover:bg-sage-50 hover:text-sage-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="glass-card rounded-2xl p-4">
                <button
                  onClick={() => setShowGuidelines(!showGuidelines)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-plus-jakarta font-semibold text-sage-800 flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Guidelines
                  </h3>
                </button>
                
                {showGuidelines && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-2"
                  >
                    {communityGuidelines.map((guideline, index) => (
                      <div key={index} className="flex items-start text-sm text-sage-600">
                        <div className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>{guideline}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Crisis Resources */}
              <div className="glass-card rounded-2xl p-4 bg-red-50/50 border-red-200/50">
                <div className="flex items-center text-red-700 mb-3">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                  <h3 className="font-plus-jakarta font-semibold">Crisis Support</h3>
                </div>
                <p className="text-red-600 text-sm mb-3">
                  If you're experiencing a mental health crisis, please reach out for immediate help.
                </p>
                <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                  Get Crisis Support
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sage-300 to-sage-500 rounded-xl flex items-center justify-center text-white font-medium text-sm">
                          {post.isAnonymous ? <EyeSlashIcon className="w-5 h-5" /> : post.authorInitials}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sage-800">{post.author}</span>
                            {post.isAnonymous && (
                              <span className="px-2 py-0.5 bg-sage-100 text-sage-600 rounded-full text-xs">
                                Anonymous
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sage-500 text-sm">
                            <ClockIcon className="w-4 h-4" />
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-sage-100 text-sage-600 rounded-full text-xs">
                              {post.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h2 className="text-lg font-plus-jakarta font-semibold text-sage-800 mb-3">
                        {post.title}
                      </h2>
                      <p className="text-sage-600 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-sage-50 text-sage-600 rounded-lg text-xs"
                        >
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-sage-100">
                      <div className="flex items-center space-x-6">
                        <motion.button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-2 text-sage-600 hover:text-red-500 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {likedPosts.has(post.id) ? (
                            <HeartIconSolid className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5" />
                          )}
                          <span className="text-sm font-medium">
                            {post.likes + (likedPosts.has(post.id) && !post.isLiked ? 1 : 0) - (post.isLiked && !likedPosts.has(post.id) ? 1 : 0)}
                          </span>
                        </motion.button>
                        
                        <motion.button
                          className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.replies} replies</span>
                        </motion.button>
                      </div>
                      
                      <motion.button
                        className="btn-secondary text-sm px-4 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reply
                      </motion.button>
                    </div>
                  </motion.div>
                ))}

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <ChatBubbleLeftIcon className="w-16 h-16 text-sage-300 mx-auto mb-4" />
                    <h3 className="text-lg font-poppins font-semibold text-sage-600 mb-2">
                      No posts found
                    </h3>
                    <p className="text-sage-500">
                      Try adjusting your search terms or category filter.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
