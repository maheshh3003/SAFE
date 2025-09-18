import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

export interface Post {
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
  createdAt: Date
}

// In-memory storage for posts (in production, this would be a database)
let posts: Post[] = [
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
    tags: ['first-time', 'therapy', 'anxiety'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
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
    tags: ['mindfulness', 'success', 'breathing'],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
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
    tags: ['friendship', 'depression', 'support'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
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
    tags: ['progress', 'self-care', 'victory'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
]

// Helper function to format timestamp
function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)
  const diffInDays = diffInHours / 24

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else if (diffInDays < 7) {
    const days = Math.floor(diffInDays)
    return `${days} day${days === 1 ? '' : 's'} ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Helper function to generate initials
function generateInitials(name: string): string {
  if (name === 'Anonymous') return 'A'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

export async function GET() {
  try {
    // Update timestamps for all posts
    const updatedPosts = posts.map(post => ({
      ...post,
      timestamp: formatTimestamp(post.createdAt)
    }))

    return NextResponse.json({ 
      posts: updatedPosts,
      stats: {
        totalPosts: posts.length,
        totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
        totalReplies: posts.reduce((sum, post) => sum + post.replies, 0),
        activeMembers: Math.floor(Math.random() * 500) + 2500, // Simulated active members
        onlineNow: Math.floor(Math.random() * 50) + 100 // Simulated online users
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    const { title, content, category, tags, isAnonymous } = body

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate new post
    const newPost: Post = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      author: isAnonymous ? 'Anonymous' : (session?.user?.name || 'Anonymous User'),
      authorInitials: isAnonymous ? 'A' : generateInitials(session?.user?.name || 'Anonymous User'),
      category,
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      isLiked: false,
      isAnonymous,
      tags: Array.isArray(tags) ? tags.filter((tag: string) => tag.trim()) : [],
      createdAt: new Date()
    }

    // Add post to the beginning of the array (newest first)
    posts.unshift(newPost)

    return NextResponse.json({ 
      message: 'Post created successfully', 
      post: newPost,
      stats: {
        totalPosts: posts.length,
        totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
        totalReplies: posts.reduce((sum, post) => sum + post.replies, 0),
        activeMembers: Math.floor(Math.random() * 500) + 2500,
        onlineNow: Math.floor(Math.random() * 50) + 100
      }
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

// Like/unlike post endpoint
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')
    const action = searchParams.get('action') // 'like' or 'unlike'

    if (!postId || !action) {
      return NextResponse.json({ error: 'Missing post ID or action' }, { status: 400 })
    }

    const postIndex = posts.findIndex(post => post.id === postId)
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (action === 'like') {
      posts[postIndex].likes += 1
    } else if (action === 'unlike') {
      posts[postIndex].likes = Math.max(0, posts[postIndex].likes - 1)
    }

    // Update timestamp
    posts[postIndex].timestamp = formatTimestamp(posts[postIndex].createdAt)

    return NextResponse.json({ 
      message: 'Post updated successfully', 
      post: posts[postIndex],
      stats: {
        totalPosts: posts.length,
        totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
        totalReplies: posts.reduce((sum, post) => sum + post.replies, 0),
        activeMembers: Math.floor(Math.random() * 500) + 2500,
        onlineNow: Math.floor(Math.random() * 50) + 100
      }
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// Delete post endpoint
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 })
    }

    const postIndex = posts.findIndex(post => post.id === postId)
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const post = posts[postIndex]

    // Check if user is authorized to delete this post
    // Allow deletion if:
    // 1. Post is anonymous and no session (allow for demo purposes)
    // 2. Post author matches current user
    // 3. User is an admin (future feature)
    if (!post.isAnonymous && session?.user?.email) {
      // For non-anonymous posts, check if the user is the author
      const postAuthorEmail = post.author.includes('@') ? post.author : null
      const currentUserName = session.user.name || session.user.email
      
      if (postAuthorEmail !== session.user.email && post.author !== currentUserName) {
        return NextResponse.json({ error: 'Unauthorized to delete this post' }, { status: 403 })
      }
    }

    // Remove the post from the array
    const deletedPost = posts.splice(postIndex, 1)[0]

    return NextResponse.json({ 
      message: 'Post deleted successfully',
      deletedPost,
      stats: {
        totalPosts: posts.length,
        totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
        totalReplies: posts.reduce((sum, post) => sum + post.replies, 0),
        activeMembers: Math.floor(Math.random() * 500) + 2500,
        onlineNow: Math.floor(Math.random() * 50) + 100
      }
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}