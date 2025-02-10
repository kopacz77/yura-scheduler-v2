import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Laptop,
  ArrowRight,
  CircleDot,
  type LucideIcon,
  type LucideProps,
  Loader2,
  Check,
  X,
  SkatingIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  logo: SkatingIcon,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  sun: Sun,
  moon: Moon,
  laptop: Laptop,
  arrowRight: ArrowRight,
  circleDot: CircleDot,
  spinner: Loader2,
  check: Check,
  close: X,
} as const;
