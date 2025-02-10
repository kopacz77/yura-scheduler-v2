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
  Snowflake,
  Users,
  DollarSign,
  Clock,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  logo: Snowflake,
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
  users: Users,
  dollarSign: DollarSign,
  clock: Clock,
} as const;
