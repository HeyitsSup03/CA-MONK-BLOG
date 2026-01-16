import { Blog } from '@/types/blog';
import {
  TrendingUp,
  GraduationCap,
  Scale,
  Puzzle,
  Monitor,
  Briefcase,
  DollarSign,
  Code,
  Calendar,
  FileText,
} from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
  onClick: () => void;
  isActive?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  FINANCE: <TrendingUp className="w-4 h-4" />,
  CAREER: <GraduationCap className="w-4 h-4" />,
  REGULATIONS: <Scale className="w-4 h-4" />,
  SKILLS: <Puzzle className="w-4 h-4" />,
  TECHNOLOGY: <Monitor className="w-4 h-4" />,
  BUSINESS: <Briefcase className="w-4 h-4" />,
  TAX: <DollarSign className="w-4 h-4" />,
  AI: <Code className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  FINANCE: 'text-blue-600',
  CAREER: 'text-purple-600',
  REGULATIONS: 'text-orange-600',
  SKILLS: 'text-green-600',
  TECHNOLOGY: 'text-indigo-600',
  BUSINESS: 'text-red-600',
  TAX: 'text-yellow-600',
  AI: 'text-pink-600',
};

export function BlogCard({ blog, onClick, isActive }: BlogCardProps) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return '1 week ago';
    if (diffInDays < 21) return '2 weeks ago';
    if (diffInDays < 30) return '3 weeks ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const primaryCategory = blog.category[0] || 'GENERAL';
  const CategoryIcon = categoryIcons[primaryCategory] || <FileText className="w-4 h-4" />;
  const categoryColor = categoryColors[primaryCategory] || 'text-gray-600';

  return (
    <div
      className={`cursor-pointer transition-all duration-300 p-3 rounded-lg border-2 mx-1 ${
        isActive
          ? 'bg-gradient-to-r from-ca-purple/15 to-ca-accent/15 border-ca-purple shadow-xl ring-2 ring-ca-purple/20'
          : 'bg-white border-gray-300 hover:border-ca-purple/60 hover:shadow-xl hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {/* Category Icon */}
        <div className={`flex-shrink-0 ${categoryColor} mt-0.5`}>
          {CategoryIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {primaryCategory}
            </span>
            {blog.category.length > 1 && (
              <span className="text-xs px-1.5 py-0.5 bg-ca-accent/10 text-ca-accent rounded-full">
                {blog.category[1]}
              </span>
            )}
          </div>

          <h3
            className={`text-sm font-bold mb-1.5 line-clamp-2 ${
              isActive ? 'text-ca-blue' : 'text-gray-900'
            }`}
          >
            {blog.title}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
            {blog.description}
          </p>

          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {getTimeAgo(blog.date)}
          </div>
        </div>
      </div>
    </div>
  );
}
