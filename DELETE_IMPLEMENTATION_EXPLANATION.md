# How to Implement Blog Deletion - Interview Explanation



## Implementation Strategy

### 1. **API Layer** (`src/api/blogs.ts`)

**What I'd add:**
```typescript
delete: async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete blog');
  }
}
```

**Why this approach:**
- **Separation of concerns**: API logic stays in the API layer
- **Error handling**: Throws errors that TanStack Query can catch
- **Type safety**: Returns `Promise<void>` since DELETE doesn't return data
- **Consistency**: Matches the pattern used for `create` and `getById`



---

### 2. **Hook Layer** (`src/hooks/useBlogs.ts`)

**What I'd add:**
```typescript
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => blogsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidate the blogs list to refetch
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      
      // Remove the specific blog from cache
      queryClient.removeQueries({ queryKey: ['blog', deletedId] });
    },
  });
};
```

**Key decisions explained:**

#### **Why `invalidateQueries` for the list?**
- The blogs list needs to refetch to show the updated list without the deleted blog
- TanStack Query automatically refetches when data is invalidated
- This ensures UI stays in sync with server state

#### **Why `removeQueries` for the detail?**
- If the user is viewing the deleted blog, we want to remove it from cache immediately
- Prevents showing stale data if they navigate back
- More efficient than invalidating (doesn't trigger a refetch we don't need)


---

### 3. **UI Layer** (`src/components/BlogDetail.tsx`)

**What I'd add:**
```typescript
interface BlogDetailProps {
  blog: Blog;
  onDelete?: (id: number) => void; // Optional callback
}

export function BlogDetail({ blog, onDelete }: BlogDetailProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`)) {
      onDelete?.(blog.id);
    }
  };

  return (
    // ... existing code ...
    {onDelete && (
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Blog
      </Button>
    )}
  );
}
```

**Design decisions:**

#### **Why optional `onDelete` prop?**
- Makes the component reusable - not all views might need delete functionality
- Follows React best practice of keeping components flexible
- Parent component controls whether delete is available

#### **Why confirmation dialog?**
- **Destructive action**: Deletion is permanent, user should confirm
- **Prevents accidents**: Reduces chance of accidental deletion
- **Better UX**: User has a chance to reconsider


---

### 4. **Page Layer** (`src/pages/HomePage.tsx`)

**What I'd add:**
```typescript
const deleteBlog = useDeleteBlog();

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

// Pass to component
<BlogDetail blog={selectedBlog} onDelete={handleDeleteBlog} />
```

**Why this logic?**

1. **Clear selection if deleted**: If the user deletes the blog they're viewing, we clear the selection
2. **Auto-select next blog**: If other blogs exist, automatically select the first one for better UX
3. **Handle edge cases**: What if it's the last blog? What if it's the currently selected one?



---

## Advanced Topics for Interview

### **Optimistic Updates** (If Asked)

**What they are**: Update UI immediately, rollback if API fails

**How to implement:**
```typescript
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => blogsApi.delete(id),
    // Optimistic update
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['blogs'] });
      
      // Snapshot previous value
      const previousBlogs = queryClient.getQueryData<Blog[]>(['blogs']);
      
      // Optimistically remove from cache
      queryClient.setQueryData<Blog[]>(['blogs'], (old) => 
        old?.filter(blog => blog.id !== deletedId) ?? []
      );
      
      return { previousBlogs };
    },
    // Rollback on error
    onError: (err, deletedId, context) => {
      if (context?.previousBlogs) {
        queryClient.setQueryData(['blogs'], context.previousBlogs);
      }
    },
    // Final cleanup
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};
```

**When to use**: For better perceived performance, especially on slow networks

**Trade-off**: More complex code, but better UX

---

### **Error Handling**

**Current implementation:**
```typescript
// TanStack Query automatically handles errors
const deleteBlog = useDeleteBlog();

// In component
{deleteBlog.isError && (
  <div className="text-red-500">
    Failed to delete blog. Please try again.
  </div>
)}
```

**Production improvements:**
- Show toast notifications instead of inline errors
- Retry logic (TanStack Query has built-in retry)
- Specific error messages based on error type
- Log errors to error tracking service (Sentry)

---

### **Loading States**

**Current implementation:**
```typescript
<Button
  disabled={deleteBlog.isPending}
  onClick={handleDelete}
>
  {deleteBlog.isPending ? 'Deleting...' : 'Delete Blog'}
</Button>
```

**Why this works:**
- Prevents double-submission
- Gives user feedback that action is in progress
- TanStack Query provides `isPending` automatically

---


**This demonstrates:**
- Understanding of TanStack Query patterns
- React best practices (props, callbacks)
- UX considerations (confirmation, feedback)
- Error handling
- Cache management strategies
