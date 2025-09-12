'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpenIcon, 
  PlayIcon, 
  DocumentTextIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  LanguageIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: 'article' | 'video' | 'worksheet' | 'guide'
  duration?: string
  rating: number
  views: number
  downloadable?: boolean
  featured?: boolean
  image: string
  videoUrl?: string // Added for YouTube links
  instructor?: string
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: A Complete Guide',
    description: 'Learn about anxiety disorders, symptoms, and evidence-based coping strategies.',
    category: 'Anxiety',
    type: 'guide',
    duration: '15 min read',
    rating: 4.8,
    views: 12500,
    downloadable: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Guided Mindfulness Meditation',
    description: 'A 10-minute guided meditation for stress relief and mental clarity.',
    category: 'Mindfulness',
    type: 'video',
    duration: '10 mins',
    rating: 4.9,
    views: 8900,
    image: 'https://img.youtube.com/vi/inpok4MKVLM/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    instructor: 'Goodful'
  },
  {
    id: '3',
    title: 'Daily Mood Tracking Worksheet',
    description: 'Track your emotions and identify patterns with this printable worksheet.',
    category: 'Self-Care',
    type: 'worksheet',
    rating: 4.7,
    views: 5600,
    downloadable: true,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'Building Healthy Relationships',
    description: 'Essential tips for creating and maintaining meaningful connections.',
    category: 'Relationships',
    type: 'article',
    duration: '8 min read',
    rating: 4.6,
    views: 7200,
    featured: true,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    title: 'Coping with Depression',
    description: 'Practical strategies for managing depression symptoms and finding hope.',
    category: 'Depression',
    type: 'guide',
    duration: '20 min read',
    rating: 4.8,
    views: 9800,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    title: 'Sleep Hygiene Checklist',
    description: 'Improve your sleep quality with this comprehensive checklist.',
    category: 'Sleep',
    type: 'worksheet',
    rating: 4.5,
    views: 4300,
    downloadable: true,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop'
  },
  // New Video Resources
  {
    id: '7',
    title: '10-Minute Meditation for Anxiety',
    description: 'A calming guided meditation to help reduce anxiety and stress naturally.',
    category: 'Anxiety',
    type: 'video',
    duration: '10:23',
    rating: 4.9,
    views: 2300000,
    featured: true,
    image: 'https://img.youtube.com/vi/O-6f5wQXSu8/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
    instructor: 'Great Meditation'
  },
  {
    id: '8',
    title: 'Breathing Exercise for Panic Attacks',
    description: 'Learn the 4-7-8 breathing technique to manage panic attacks and anxiety.',
    category: 'Anxiety',
    type: 'video',
    duration: '8:12',
    rating: 4.7,
    views: 890000,
    image: 'https://img.youtube.com/vi/YRPh_GaiL8s/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=YRPh_GaiL8s',
    instructor: 'Andrew Huberman'
  },
  {
    id: '9',
    title: '5-Minute Daily Mindfulness',
    description: 'Quick daily mindfulness practice you can do anywhere to reduce stress.',
    category: 'Mindfulness',
    type: 'video',
    duration: '5:15',
    rating: 4.8,
    views: 1560000,
    image: 'https://img.youtube.com/vi/inpok4MKVLM/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    instructor: 'Goodful'
  },
  {
    id: '10',
    title: 'Understanding Depression - What You Need to Know',
    description: 'Educational video about depression symptoms, causes, and treatment options.',
    category: 'Depression',
    type: 'video',
    duration: '15:45',
    rating: 4.6,
    views: 450000,
    image: 'https://img.youtube.com/vi/z-IR48Mb3W0/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=z-IR48Mb3W0',
    instructor: 'Psych2Go'
  },
  {
    id: '11',
    title: 'Progressive Muscle Relaxation',
    description: 'Full body relaxation technique to release tension and reduce stress.',
    category: 'Relaxation',
    type: 'video',
    duration: '18:30',
    rating: 4.7,
    views: 780000,
    image: 'https://img.youtube.com/vi/86HUcX8ZtAk/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=86HUcX8ZtAk',
    instructor: 'The Honest Guys'
  },
  {
    id: '12',
    title: 'Sleep Meditation for Insomnia',
    description: 'Gentle guided meditation to help you fall asleep peacefully.',
    category: 'Sleep',
    type: 'video',
    duration: '30:00',
    rating: 4.8,
    views: 3200000,
    featured: true,
    image: 'https://img.youtube.com/vi/YRPh_GaiL8s/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=YRPh_GaiL8s',
    instructor: 'Jason Stephenson'
  },
  {
    id: '13',
    title: 'How to Deal with Anxiety - Practical Tips',
    description: 'Evidence-based strategies and practical tips for managing anxiety disorders.',
    category: 'Anxiety',
    type: 'video',
    duration: '12:18',
    rating: 4.5,
    views: 670000,
    image: 'https://img.youtube.com/vi/WWloIAQpMcQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=WWloIAQpMcQ',
    instructor: 'TEDx Talks'
  },
  {
    id: '14',
    title: 'Morning Meditation - Start Your Day Right',
    description: 'Energizing morning meditation to set positive intentions for the day.',
    category: 'Mindfulness',
    type: 'video',
    duration: '10:00',
    rating: 4.6,
    views: 920000,
    image: 'https://img.youtube.com/vi/ssss7V1_eyA/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ssss7V1_eyA',
    instructor: 'Great Meditation'
  }
]

const categories = ['All', 'Anxiety', 'Depression', 'Mindfulness', 'Relationships', 'Self-Care', 'Sleep', 'Mental Health', 'Relaxation']
const types = ['All', 'Article', 'Video', 'Worksheet', 'Guide']

const typeIcons = {
  article: DocumentTextIcon,
  video: PlayIcon,
  worksheet: DocumentTextIcon,
  guide: BookOpenIcon
}

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory
    const matchesType = selectedType === 'All' || resource.type === selectedType.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesType
  })

  const featuredResources = resources.filter(r => r.featured)

  const handleVideoClick = (videoUrl?: string) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50">
      <Navigation />
      
      <div className="pt-20 pb-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-soft border border-sage-200/30 text-sage-700 mb-6">
              <BookOpenIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Expert-Curated Resources</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-plus-jakarta font-bold text-sage-800 mb-8">
              Mental Health Resources
            </h1>
            
            <p className="text-xl text-sage-600 max-w-3xl mx-auto mb-10 font-dm-sans leading-relaxed">
              Evidence-based tools, guides, videos, and resources to support your mental wellness journey. 
              All content is reviewed by licensed mental health professionals.
            </p>
            
            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto">
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-transparent border-none text-sage-800 placeholder-sage-400 focus:outline-none"
                    />
                  </div>
                  
                  <motion.button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-3 rounded-xl bg-white/60 border border-white/30 text-sage-600 hover:bg-white/80 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FunnelIcon className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {/* Filters */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/30"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sage-700 font-medium mb-2">Category</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white/60 border border-white/30 rounded-xl text-sage-800 focus:outline-none focus:ring-2 focus:ring-sage-300"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sage-700 font-medium mb-2">Type</label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full px-3 py-2 bg-white/60 border border-white/30 rounded-xl text-sage-800 focus:outline-none focus:ring-2 focus:ring-sage-300"
                        >
                          {types.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Resources */}
        {searchTerm === '' && selectedCategory === 'All' && selectedType === 'All' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <h2 className="text-2xl font-plus-jakarta font-bold text-sage-800 mb-8">Featured Resources</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {featuredResources.map((resource, index) => {
                const IconComponent = typeIcons[resource.type]
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl overflow-hidden card-hover group cursor-pointer"
                    onClick={() => handleVideoClick(resource.videoUrl)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-sage-200 to-beige-200 relative">
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-sage-700">
                          Featured
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-sage-400 to-sage-600 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {resource.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform duration-300">
                            <PlayIcon className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium">
                          {resource.category}
                        </span>
                        <div className="flex items-center text-sage-500 text-sm">
                          <StarIcon className="w-4 h-4 fill-current text-yellow-400 mr-1" />
                          {resource.rating}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-plus-jakarta font-semibold text-sage-800 mb-3 group-hover:text-sage-600 transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-sage-600 text-base mb-4 leading-relaxed font-dm-sans">
                        {resource.description}
                      </p>
                      
                      {resource.instructor && (
                        <p className="text-sage-500 text-sm mb-3">
                          by {resource.instructor}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sage-500 text-xs">
                          {resource.duration && (
                            <>
                              <ClockIcon className="w-4 h-4 mr-1" />
                              <span className="mr-3">{resource.duration}</span>
                            </>
                          )}
                          <EyeIcon className="w-4 h-4 mr-1" />
                          <span>{resource.views.toLocaleString()} views</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {resource.videoUrl && (
                            <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                              Watch on YouTube
                            </span>
                          )}
                          {resource.downloadable && (
                            <button className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors duration-300">
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-plus-jakarta font-bold text-sage-800">
              All Resources ({filteredResources.length})
            </h2>
            
            {(selectedCategory !== 'All' || selectedType !== 'All' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedType('All')
                  setSearchTerm('')
                }}
                className="text-sage-600 hover:text-sage-800 text-sm font-medium transition-colors duration-300"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const IconComponent = typeIcons[resource.type]
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden card-hover group cursor-pointer"
                  onClick={() => handleVideoClick(resource.videoUrl)}
                >
                  <div className="aspect-video bg-gradient-to-br from-sage-200 to-beige-200 relative">
                    <img 
                      src={resource.image} 
                      alt={resource.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-sage-700 capitalize">
                        {resource.type}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {resource.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform duration-300">
                          <PlayIcon className="w-7 h-7 text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium">
                        {resource.category}
                      </span>
                      <div className="flex items-center text-sage-500 text-sm">
                        <StarIcon className="w-4 h-4 fill-current text-yellow-400 mr-1" />
                        {resource.rating}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-plus-jakarta font-semibold text-sage-800 mb-2 group-hover:text-sage-600 transition-colors">
                      {resource.title}
                    </h3>
                    
                    <p className="text-sage-600 text-sm mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    
                    {resource.instructor && (
                      <p className="text-sage-500 text-xs mb-3">
                        by {resource.instructor}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sage-500 text-xs">
                        {resource.duration && (
                          <>
                            <ClockIcon className="w-4 h-4 mr-1" />
                            <span className="mr-3">{resource.duration}</span>
                          </>
                        )}
                        <EyeIcon className="w-4 h-4 mr-1" />
                        <span>{resource.views.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {resource.videoUrl && (
                          <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                            YouTube
                          </span>
                        )}
                        {resource.downloadable && (
                          <button className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors duration-300">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpenIcon className="w-16 h-16 text-sage-300 mx-auto mb-4" />
              <h3 className="text-lg font-plus-jakarta font-semibold text-sage-600 mb-2">
                No resources found
              </h3>
              <p className="text-sage-500">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-plus-jakarta font-bold text-sage-800 mb-4">
              Need Personalized Support?
            </h2>
            
            <p className="text-sage-600 mb-6">
              While these resources are helpful, sometimes you need one-on-one support. 
              Connect with our licensed professionals for personalized care.
            </p>
            
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book a Session
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
