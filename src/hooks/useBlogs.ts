import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsApi } from '@/api/blogs';
import { CreateBlogInput } from '@/types/blog';

export const BLOGS_QUERY_KEY = ['blogs'];

export const useBlogs = () => {
  return useQuery({
    queryKey: BLOGS_QUERY_KEY,
    queryFn: blogsApi.getAll,
  });
};

export const useBlog = (id: number | null) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogsApi.getById(id!),
    enabled: id !== null,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blog: CreateBlogInput) => blogsApi.create(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => blogsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidate the blogs list to refetch
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
      
      // Remove the specific blog from cache
      queryClient.removeQueries({ queryKey: ['blog', deletedId] });
    },
  });
};
