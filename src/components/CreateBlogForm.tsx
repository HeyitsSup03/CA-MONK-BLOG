import { useState } from 'react';
import { useCreateBlog } from '@/hooks/useBlogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export function CreateBlogForm() {
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');

  const createBlog = useCreateBlog();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryArray = categories
      .split(',')
      .map((cat) => cat.trim().toUpperCase())
      .filter((cat) => cat.length > 0);

    createBlog.mutate(
      {
        title,
        category: categoryArray,
        description,
        coverImage,
        content,
      },
      {
        onSuccess: () => {
          setTitle('');
          setCategories('');
          setDescription('');
          setCoverImage('');
          setContent('');
        },
      }
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-ca-blue to-ca-blue-dark text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-white">
          <PlusCircle className="w-5 h-5" />
          Create New Blog
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium mb-1"
            >
              Categories (comma-separated)
            </label>
            <Input
              id="categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="e.g., TECH, FINANCE, AI"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              required
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium mb-1"
            >
              Cover Image URL
            </label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              required
              rows={8}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={createBlog.isPending}
            size="lg"
          >
            {createBlog.isPending ? 'Creating...' : 'Create Blog'}
          </Button>

          {createBlog.isError && (
            <p className="text-sm text-red-500">
              Failed to create blog. Please try again.
            </p>
          )}

          {createBlog.isSuccess && (
            <p className="text-sm text-green-600">
              Blog created successfully!
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
