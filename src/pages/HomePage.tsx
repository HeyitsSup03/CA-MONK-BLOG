import { useState, useEffect } from 'react';
import { useBlogs, useBlog, useDeleteBlog } from '@/hooks/useBlogs';
import { BlogCard } from '@/components/BlogCard';
import { BlogDetail } from '@/components/BlogDetail';
import { CreateBlogForm } from '@/components/CreateBlogForm';
import { BlogCardSkeleton } from '@/components/BlogCardSkeleton';
import { BlogDetailSkeleton } from '@/components/BlogDetailSkeleton';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileText } from 'lucide-react';

export function HomePage() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: blogs, isLoading: blogsLoading, isError: blogsError } = useBlogs();
  const {
    data: selectedBlog,
    isLoading: blogLoading,
    isError: blogError,
  } = useBlog(selectedBlogId);
  const deleteBlog = useDeleteBlog();

  // Set first blog as selected by default if available
  useEffect(() => {
    if (blogs && blogs.length > 0 && !selectedBlogId && !showCreateForm) {
      setSelectedBlogId(blogs[0].id);
    }
  }, [blogs, selectedBlogId, showCreateForm]);

  const handleDeleteBlog = (id: number) => {
    deleteBlog.mutate(id, {
      onSuccess: () => {
        // Clear selected blog if it was deleted
        if (selectedBlogId === id) {
          setSelectedBlogId(null);
        }
        // If there are other blogs, select the first one
        if (blogs && blogs.length > 1) {
          const remainingBlogs = blogs.filter((blog) => blog.id !== id);
          if (remainingBlogs.length > 0) {
            setSelectedBlogId(remainingBlogs[0].id);
          }
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        showCreateForm={showCreateForm}
        onToggleCreateForm={() => setShowCreateForm(!showCreateForm)}
      />

      {showCreateForm ? (
        <div className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
          <CreateBlogForm />
        </div>
      ) : (
        <>
          {/* Blog Header Section */}
          <div className="bg-gradient-to-br from-gray-50 via-white to-ca-accent/5 border-b border-gray-200">
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-ca-blue mb-4 tracking-tight">
                CA Monk Blog
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Stay updated with the latest trends in finance, accounting, and
                career growth
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Sidebar - Latest Articles */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                <h2 className="text-2xl font-bold text-ca-blue mb-6">
                  Latest Articles
                </h2>

                {blogsLoading && (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <BlogCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {blogsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                      Failed to load blogs. Make sure JSON Server is running on
                      http://localhost:3001
                    </p>
                  </div>
                )}

                {blogs && blogs.length === 0 && (
                  <div className="bg-ca-accent/10 border border-ca-accent/20 rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 text-ca-accent mx-auto mb-3" />
                    <p className="text-ca-blue mb-2 font-semibold">No blogs yet</p>
                    <p className="text-sm text-gray-600">
                      Create your first blog post to get started
                    </p>
                  </div>
                )}

                {blogs && blogs.length > 0 && (
                  <div className="space-y-4 pr-2">
                    {blogs.map((blog) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        onClick={() => setSelectedBlogId(blog.id)}
                        isActive={selectedBlogId === blog.id}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Section - Main Article */}
              <div className="lg:col-span-7">
                {!selectedBlogId && (
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-lg p-16 text-center">
                    <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 font-medium mb-2">
                      Select an article to read
                    </p>
                    <p className="text-sm text-gray-500">
                      Choose from the latest articles on the left
                    </p>
                  </div>
                )}

                {blogLoading && <BlogDetailSkeleton />}

                {blogError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Failed to load blog details</p>
                  </div>
                )}

                {selectedBlog && (
                  <BlogDetail
                    blog={selectedBlog}
                    onDelete={handleDeleteBlog}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
