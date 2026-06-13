"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
}

export default function StarRating({ rating, max = 5, size = 16, className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-${size / 4} w-${size / 4}`}
          style={{ width: size, height: size }}
          fill={i < Math.round(rating) ? "#f59e0b" : "none"}
          stroke={i < Math.round(rating) ? "#f59e0b" : "#cbd5e1"}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}
