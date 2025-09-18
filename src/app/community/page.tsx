'use client'

import { useState, useEffect } from 'react'
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
  ExclamationTriangleIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Navigation from '@/components/Navigation'
import AddPostModal from '@/components/AddPostModal'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal'
import { useAuth } from '@/contexts/AuthContext'

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

interface CommunityStats {
  totalPosts: number
  totalLikes: number
  totalReplies: number
  activeMembers: number
  onlineNow: number
}

const categories = ['All', 'Therapy', 'Mindfulness', 'Support', 'Progress', 'Anxiety', 'Depression']

const communityGuidelines = [
  'Be respectful and kind to all members',
  'Respect privacy and confidentiality', 
  'No medical advice - seek professional help',
  'Use content warnings for sensitive topics',
  'Report inappropriate content to moderators'
]

export default function CommunityPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalLikes: 0,
    totalReplies: 0,
    activeMembers: 0,
    onlineNow: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [showAddPostModal, setShowAddPostModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch posts and stats from API
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data.posts || [])
      setStats(data.stats || {
        totalPosts: 0,
        totalLikes: 0,
        totalReplies: 0,
        activeMembers: 0,
        onlineNow: 0
      })
      
      // Initialize liked posts from the posts data
      const initialLikedPosts = new Set<string>(
        data.posts?.filter((post: Post) => post.isLiked).map((post: Post) => post.id) || []
      )
      setLikedPosts(initialLikedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    const isCurrentlyLiked = likedPosts.has(postId)
    const newLikedPosts = new Set(likedPosts)
    
    if (isCurrentlyLiked) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    
    // Optimistically update UI
    setLikedPosts(newLikedPosts)
    
    // Update posts state to reflect like change
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: isCurrentlyLiked ? Math.max(0, post.likes - 1) : post.likes + 1 
            }
          : post
      )
    )

    try {
      const response = await fetch(`/api/posts?id=${postId}&action=${isCurrentlyLiked ? 'unlike' : 'like'}`, {
        method: 'PATCH'
      })

      if (!response.ok) {
        throw new Error('Failed to update like')
      }

      const data = await response.json()
      
      // Update with server response
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? data.post : post
        )
      )
      setStats(data.stats)
    } catch (error) {
      console.error('Error updating like:', error)
      
      // Revert optimistic update on error
      setLikedPosts(likedPosts)
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: isCurrentlyLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
              }
            : post
        )
      )
    }
  }

  const handlePostCreated = (newPost: Post, newStats: CommunityStats) => {
    // Add new post to the beginning of the array
    setPosts(prevPosts => [newPost, ...prevPosts])
    setStats(newStats)
    setShowAddPostModal(false)
  }

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
  }

  const confirmDeletePost = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/posts?id=${postToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete post')
      }

      const data = await response.json()
      
      // Remove post from state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete.id))
      setStats(data.stats)
      
      // Close modal and reset state
      setShowDeleteModal(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      // You could add error toast/notification here
      alert('Failed to delete post. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDeletePost = () => {
    if (!isDeleting) {
      setShowDeleteModal(false)
      setPostToDelete(null)
    }
  }

  // Helper function to check if current user can delete a post
  const canDeletePost = (post: Post): boolean => {
    if (!user) return false
    
    // If post is anonymous, allow deletion (for demo purposes)
    if (post.isAnonymous) return true
    
    // Check if current user is the author
    const currentUserName = user.user_metadata?.full_name || user.email
    return post.author === currentUserName || post.author === user.email
  }

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sage-300 border-t-sage-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sage-600">Loading community posts...</p>
          </div>
        </div>
      </div>
    )
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
              { label: 'Active Members', value: stats.activeMembers.toLocaleString(), icon: UserGroupIcon },
              { label: 'Support Posts', value: stats.totalPosts.toLocaleString(), icon: ChatBubbleLeftIcon },
              { label: 'Helpful Responses', value: stats.totalLikes.toLocaleString(), icon: HeartIcon },
              { label: 'Online Now', value: stats.onlineNow.toLocaleString(), icon: ClockIcon }
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
                onClick={() => setShowAddPostModal(true)}
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

                      {/* Delete Button - Only visible to post author */}
                      {canDeletePost(post) && (
                        <motion.button
                          onClick={() => handleDeletePost(post)}
                          className="p-2 text-sage-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete post"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </motion.button>
                      )}
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

      {/* Add Post Modal */}
      <AddPostModal
        isOpen={showAddPostModal}
        onClose={() => setShowAddPostModal(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeletePost}
        onConfirm={confirmDeletePost}
        postTitle={postToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  )
}
