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

**Interview talking point**: "I keep all API calls in one place so if we need to change the API client (e.g., switch from fetch to axios), we only update one file."

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

**Interview talking point**: "I use both `invalidateQueries` and `removeQueries` because they serve different purposes. Invalidation triggers a refetch for data that might still be needed, while removal cleans up data that's definitely gone."

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

**Interview talking point**: "I use `window.confirm` for simplicity, but in production I'd use a proper modal component from shadcn/ui for better styling and accessibility."

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

**Interview talking point**: "I handle the UI state updates in the `onSuccess` callback because the mutation might succeed but we still need to update local state. This keeps the UI in sync with both server state and local state."

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

## Interview Q&A

### **Q: Why use TanStack Query mutations instead of manual state updates?**

**A**: 
- **Automatic loading/error states**: No need to manually manage `isLoading`, `isError`
- **Cache management**: Automatically handles cache invalidation
- **Request deduplication**: Multiple clicks = one request
- **Retry logic**: Built-in retry on failure
- **Optimistic updates**: Easy to implement for better UX
- **Less boilerplate**: ~70% less code than manual implementation

### **Q: How does cache invalidation work here?**

**A**:
1. User deletes blog → `deleteBlog.mutate(id)` called
2. API call succeeds → `onSuccess` callback fires
3. `invalidateQueries(['blogs'])` marks cache as stale
4. Components using `useBlogs()` detect stale data
5. TanStack Query automatically refetches in background
6. UI updates with new data (blog list without deleted item)

**Why this is better than manual updates:**
- Single source of truth (server)
- Handles edge cases (what if another user deleted it?)
- Works across all components automatically

### **Q: What if the deletion fails?**

**A**:
- TanStack Query sets `isError: true`
- We can show error message to user
- Optionally implement retry logic
- Cache remains unchanged (no optimistic update rollback needed if we didn't use optimistic updates)

### **Q: How would you handle permissions? (Only author can delete)**

**A**:
```typescript
// Add to Blog type
interface Blog {
  // ... existing fields
  authorId: number;
}

// In component
{currentUser?.id === blog.authorId && (
  <Button onClick={handleDelete}>Delete</Button>
)}
```

**Backend should also validate** - frontend checks are for UX, not security.

### **Q: What about soft deletes vs hard deletes?**

**A**:
- **Hard delete** (current): Permanently removes from database
- **Soft delete**: Mark as deleted, keep in database

**For soft delete:**
```typescript
// API would be PATCH instead of DELETE
update: async (id: number, data: { deleted: boolean }) => {
  // Update blog with deleted flag
}

// Filter in query
getAll: async (): Promise<Blog[]> => {
  const blogs = await fetch(`${API_BASE_URL}/blogs`);
  return blogs.filter(blog => !blog.deleted);
}
```

**When to use soft delete**: Need to restore, audit trail, or "undo" functionality

---

## Summary for Interview

**30-second explanation:**
"I'd implement deletion by adding a `delete` function to the API layer, creating a `useDeleteBlog` mutation hook that invalidates the blogs list cache and removes the specific blog from cache, then adding a delete button to the BlogDetail component with confirmation. The parent component handles the mutation and updates local state to clear the selection if the deleted blog was being viewed."

**Key points to emphasize:**
1. ✅ **Separation of concerns**: API → Hook → Component
2. ✅ **Cache management**: Both invalidation and removal
3. ✅ **User experience**: Confirmation, loading states, error handling
4. ✅ **Edge cases**: What if viewing deleted blog? What if it's the last one?
5. ✅ **Scalability**: Pattern works for any delete operation

**This demonstrates:**
- Understanding of TanStack Query patterns
- React best practices (props, callbacks)
- UX considerations (confirmation, feedback)
- Error handling
- Cache management strategies
