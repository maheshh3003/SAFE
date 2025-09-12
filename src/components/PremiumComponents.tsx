'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export function PremiumCard({ 
  children, 
  className = '', 
  hover = true, 
  glow = false, 
  gradient = false 
}: PremiumCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/10
        ${gradient 
          ? 'bg-gradient-to-br from-white/20 via-white/10 to-white/5' 
          : 'bg-white/10'
        }
        ${glow ? 'shadow-2xl shadow-sage-500/20' : 'shadow-xl shadow-black/10'}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        y: -5, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-400/10 via-transparent to-beige-300/10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sage-400/20 to-beige-300/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" 
           style={{ padding: '1px' }}>
        <div className="w-full h-full rounded-3xl bg-transparent" />
      </div>
    </motion.div>
  );
}

interface GlowButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function GlowButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick,
  disabled = false
}: GlowButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-sage-500 to-sage-600 text-white shadow-lg shadow-sage-500/30 hover:shadow-sage-500/50',
    secondary: 'bg-gradient-to-r from-beige-400 to-beige-500 text-sage-900 shadow-lg shadow-beige-400/30 hover:shadow-beige-400/50',
    ghost: 'bg-white/10 backdrop-blur-sm text-sage-700 border border-sage-300/30 hover:bg-white/20'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-2xl font-medium transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { 
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      disabled={disabled}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 hover:translate-x-full" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </motion.button>
  );
}

interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function FloatingLabelInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = ''
}: FloatingLabelInputProps) {
  const hasValue = value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-sage-300/30 
          rounded-2xl text-sage-800 placeholder-transparent focus:outline-none 
          focus:border-sage-500 focus:bg-white/20 transition-all duration-300
          text-lg
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.label
        className="
          absolute left-4 text-sage-600 transition-all duration-300 pointer-events-none
          text-lg
        "
        animate={{
          top: hasValue ? '0.5rem' : '1rem',
          fontSize: hasValue ? '0.875rem' : '1.125rem',
          color: hasValue ? '#6b7c5a' : '#8a9b7a'
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
    </div>
  );
}

interface AnimatedIconProps {
  icon: ReactNode;
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

export function AnimatedIcon({ 
  icon, 
  size = 24, 
  color = 'currentColor', 
  animate = true,
  className = ''
}: AnimatedIconProps) {
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, color }}
      whileHover={animate ? { 
        scale: 1.1,
        rotate: 5,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : {}}
      whileTap={animate ? { scale: 0.95 } : {}}
    >
      {icon}
    </motion.div>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#a8c686',
  backgroundColor = '#e5e7eb',
  animated = true
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={animated ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ 
            strokeDasharray: circumference,
            strokeDashoffset: animated ? offset : circumference - (progress / 100) * circumference
          }}
        />
      </svg>
      
      {/* Progress text */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <span className="text-2xl font-bold text-sage-700">
          {Math.round(progress)}%
        </span>
      </motion.div>
    </div>
  );
}
