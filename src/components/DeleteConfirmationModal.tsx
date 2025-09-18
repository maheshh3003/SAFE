'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  postTitle: string
  isDeleting: boolean
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  postTitle, 
  isDeleting 
}: DeleteConfirmationModalProps) {
  const handleClose = () => {
    if (!isDeleting) {
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
            className="glass-card rounded-2xl p-6 w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-plus-jakarta font-bold text-sage-800">
                    Delete Post
                  </h2>
                  <p className="text-sage-600 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="p-2 hover:bg-sage-100 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                <XMarkIcon className="w-6 h-6 text-sage-600" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-sage-700 mb-4">
                Are you sure you want to delete this post?
              </p>
              
              <div className="bg-sage-50/50 border border-sage-200/50 rounded-xl p-4">
                <h3 className="font-medium text-sage-800 mb-2 truncate">
                  "{postTitle}"
                </h3>
                <p className="text-sage-600 text-sm">
                  This post and all its interactions will be permanently removed from the community.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="px-6 py-3 text-sage-600 hover:bg-sage-50 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              
              <motion.button
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={!isDeleting ? { scale: 1.05 } : {}}
                whileTap={!isDeleting ? { scale: 0.95 } : {}}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete Post</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}