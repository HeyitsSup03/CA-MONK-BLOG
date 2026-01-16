import { Blog } from '@/types/blog';
import { Calendar, Share2, ThumbsUp, MessageCircle, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogDetailProps {
  blog: Blog;
  onDelete?: (id: number) => void;
}

export function BlogDetail({ blog, onDelete }: BlogDetailProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`)) {
      onDelete?.(blog.id);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  const readTime = calculateReadTime(blog.content);
  const primaryCategory = blog.category[0] || 'GENERAL';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100">
      {/* Featured Image */}
      <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-ca-blue-dark to-ca-purple">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="p-8">
        {/* Category and Read Time */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span className="font-semibold uppercase tracking-wide">
            {primaryCategory}
          </span>
          <span>•</span>
          <span>{readTime} min read</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6 text-ca-blue leading-tight">
          {blog.title}
        </h1>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3">
          <Button variant="default" size="sm" className="shadow-md hover:shadow-lg transition-shadow">
            <Share2 className="w-4 h-4 mr-2" />
            Share Article
          </Button>
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Blog
            </Button>
          )}
        </div>

        {/* Metadata Box */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Category
            </div>
            <div className="text-sm font-medium text-gray-900">
              {blog.category.join(' & ')}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Read Time
            </div>
            <div className="text-sm font-medium text-gray-900">{readTime} Mins</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Date
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(blog.date)}
            </div>
          </div>
        </div>

        {/* Description as Introduction */}
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {blog.description}
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed space-y-4">
            {blog.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('#')) {
                const level = paragraph.match(/^#+/)?.[0].length || 0;
                const text = paragraph.replace(/^#+\s*/, '');
                const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
                return (
                  <HeadingTag
                    key={index}
                    className={`font-bold text-ca-blue mt-8 mb-4 ${
                      level === 1
                        ? 'text-2xl'
                        : level === 2
                        ? 'text-xl'
                        : 'text-lg'
                    }`}
                  >
                    {text}
                  </HeadingTag>
                );
              }
              if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
                const items = paragraph
                  .split(/\n/)
                  .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('*'))
                  .map((line) => line.replace(/^[-*]\s*/, ''));
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                    {items.map((item, i) => (
                      <li key={i} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.trim().startsWith('"') && paragraph.trim().endsWith('"')) {
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-ca-accent bg-ca-accent/5 pl-6 py-4 italic text-gray-700 my-6"
                  >
                    {paragraph.replace(/^["']|["']$/g, '')}
                  </blockquote>
                );
              }
              return (
                <p key={index} className="text-gray-800 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Author Section */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ca-purple to-ca-accent flex items-center justify-center text-white font-bold">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Written by Author</div>
              <div className="text-sm text-gray-600">Content Creator</div>
            </div>
          </div>

          {/* Interaction Icons */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-ca-purple hover:bg-ca-purple/10 transition-all duration-200">
              <ThumbsUp className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-ca-purple hover:bg-ca-purple/10 transition-all duration-200">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
