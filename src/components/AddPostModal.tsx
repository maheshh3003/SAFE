'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  TagIcon,
  EyeSlashIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'

interface AddPostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreated: (post: any, stats: any) => void
}

const categories = ['Therapy', 'Mindfulness', 'Support', 'Progress', 'Anxiety', 'Depression', 'Self-Care', 'Recovery']

export default function AddPostModal({ isOpen, onClose, onPostCreated }: AddPostModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Support',
    tags: '',
    isAnonymous: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both title and content')
      return
    }

    if (formData.content.length < 10) {
      setError('Content must be at least 10 characters long')
      return
    }

    if (formData.title.length > 100) {
      setError('Title must be less than 100 characters')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 5) // Limit to 5 tags

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: tags,
          isAnonymous: formData.isAnonymous
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const data = await response.json()
      
      setSuccess(true)
      
      // Call the parent callback to update the posts list and stats
      onPostCreated(data.post, data.stats)
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'Support',
        tags: '',
        isAnonymous: false
      })

      // Close modal after a short delay to show success message
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1500)

    } catch (error) {
      console.error('Error creating post:', error)
      setError(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        content: '',
        category: 'Support',
        tags: '',
        isAnonymous: false
      })
      setError('')
      setSuccess(false)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-plus-jakarta font-bold text-sage-800">
                Share Your Thoughts
              </h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-sage-100 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                <XMarkIcon className="w-6 h-6 text-sage-600" />
              </button>
            </div>

            {success ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-plus-jakarta font-semibold text-sage-800 mb-2">
                  Post Created Successfully!
                </h3>
                <p className="text-sage-600">
                  Your post has been shared with the community.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Author Info */}
                <div className="flex items-center space-x-3 p-4 bg-sage-50/50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-sage-300 to-sage-500 rounded-xl flex items-center justify-center text-white font-medium">
                    {formData.isAnonymous ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sage-800">
                      {formData.isAnonymous ? 'Anonymous' : (user?.user_metadata?.full_name || user?.email || 'User')}
                    </div>
                    <div className="text-sage-500 text-sm">
                      Posting to Community
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-sage-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="What would you like to share?"
                    maxLength={100}
                    className="w-full px-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent"
                    required
                  />
                  <div className="text-right text-xs text-sage-400 mt-1">
                    {formData.title.length}/100
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-sage-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Share your thoughts, experiences, or questions with the community..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
                    required
                  />
                  <div className="text-xs text-sage-500 mt-1">
                    Minimum 10 characters required
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-sage-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-sage-700 mb-2">
                    Tags (optional)
                  </label>
                  <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="Enter tags separated by commas (max 5)"
                      className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent"
                    />
                  </div>
                  <div className="text-xs text-sage-500 mt-1">
                    Example: anxiety, coping, support
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-sage-600 bg-white border-sage-300 rounded focus:ring-sage-300 focus:ring-2"
                  />
                  <label htmlFor="isAnonymous" className="flex items-center text-sm text-sage-700">
                    <EyeSlashIcon className="w-4 h-4 mr-2" />
                    Post anonymously
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-xl"
                  >
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Guidelines Reminder */}
                <div className="p-4 bg-blue-50/50 border border-blue-200/30 rounded-xl">
                  <div className="text-sm text-blue-700">
                    <strong>Community Guidelines Reminder:</strong>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Be respectful and supportive to all members</li>
                      <li>• No personal medical advice - encourage professional help</li>
                      <li>• Use content warnings for sensitive topics</li>
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 text-sage-600 hover:bg-sage-50 rounded-xl transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                    className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting...' : 'Share Post'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}