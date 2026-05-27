"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  image: string;
  category: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

type BlogManagerProps = {
  getToken: () => string | null;
  onUnauthorized: () => void;
  apiBase?: "/api/admin" | "/api/staff";
  backHref?: string;
  backLabel?: string;
  showPageHeader?: boolean;
};

export function BlogManager({
  getToken,
  onUnauthorized,
  apiBase = "/api/admin",
  backHref,
  backLabel = "← Back",
  showPageHeader = true,
}: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    author: "The Stems Team",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "",
    category: "",
    tags: "",
    readTime: 5,
    featured: false,
  });

  const authHeaders = useCallback(() => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getToken]);

  const fetchPosts = useCallback(async () => {
    setLoadError(null);

    try {
      const response = await axios.get(`${apiBase}/blogs`, {
        headers: authHeaders(),
        withCredentials: true,
        timeout: 20000,
      });
      setPosts(response.data);
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 401) {
        setLoadError("Your session expired. Please sign in again.");
        return;
      }
      setLoadError("Could not load blog posts. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [apiBase, authHeaders, getToken]);

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      onUnauthorized();
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const publishedAtISO = formData.publishedAt
        ? new Date(formData.publishedAt).toISOString()
        : new Date().toISOString();

      const payload = {
        ...formData,
        publishedAt: publishedAtISO,
        tags: tagsArray,
        readTime: parseInt(String(formData.readTime), 10),
      };

      if (editingPost) {
        await axios.put(`${apiBase}/blogs/${editingPost.id}`, payload, {
          headers: authHeaders(),
          withCredentials: true,
        });
      } else {
        await axios.post(`${apiBase}/blogs`, payload, {
          headers: authHeaders(),
          withCredentials: true,
        });
      }

      setShowForm(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      alert(message || "Failed to save blog post");
    }
  };

  const handleEdit = async (post: BlogPost) => {
    const token = getToken();
    if (!token) {
      onUnauthorized();
      return;
    }

    setLoadingEditId(post.id);
    try {
      let full = post;
      if (!post.content) {
        const response = await axios.get(`${apiBase}/blogs/${post.id}`, {
          headers: authHeaders(),
          withCredentials: true,
          timeout: 20000,
        });
        full = response.data;
      }

      setEditingPost(full);
      setFormData({
        slug: full.slug,
        title: full.title,
        excerpt: full.excerpt,
        content: full.content,
        author: full.author,
        publishedAt: full.published_at.split("T")[0],
        image: full.image,
        category: full.category,
        tags: full.tags.join(", "),
        readTime: full.read_time,
        featured: full.featured,
      });
      setShowForm(true);
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 401) {
        onUnauthorized();
        return;
      }
      alert("Could not load this post for editing. Please try again.");
    } finally {
      setLoadingEditId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    const token = getToken();
    if (!token) {
      onUnauthorized();
      return;
    }

    try {
      await axios.delete(`${apiBase}/blogs/${id}`, {
        headers: authHeaders(),
        withCredentials: true,
      });
      fetchPosts();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      alert(message || "Failed to delete blog post");
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      author: "The Stems Team",
      publishedAt: new Date().toISOString().split("T")[0],
      image: "",
      category: "",
      tags: "",
      readTime: 5,
      featured: false,
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const token = getToken();
    if (!token) {
      alert("Please log in to upload images.");
      onUnauthorized();
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataObj = new FormData();
        formDataObj.append("file", file);

        const response = await fetch(`${apiBase}/upload-blog-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
          body: formDataObj,
        });

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(data?.message || `Upload failed (${response.status})`);
        }
        if (!data?.url) {
          throw new Error("Image uploaded but URL is missing.");
        }
        return data.url as string;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({ ...prev, image: uploadedUrls[0] }));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to upload image.";
      alert(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-brand-gray-600">Loading blog posts…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="staff-panel p-6 text-center space-y-3">
        <p className="text-brand-gray-700">{loadError}</p>
        <div className="flex justify-center gap-2 flex-wrap">
          <button type="button" className="staff-btn staff-btn-primary text-sm" onClick={() => fetchPosts()}>
            Try again
          </button>
          {loadError.includes("session") ? (
            <button type="button" className="staff-btn staff-btn-outline text-sm" onClick={onUnauthorized}>
              Sign in
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        {showPageHeader ? (
          <div className="flex items-center gap-3">
            {backHref ? (
              <Link href={backHref} className="text-brand-gray-600 hover:text-brand-green text-sm">
                {backLabel}
              </Link>
            ) : null}
            <h1 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900">
              Manage Blog Posts
            </h1>
          </div>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setEditingPost(null);
            resetForm();
          }}
          className="btn-primary text-sm"
        >
          + New Post
        </button>
      </div>

      {showForm ? (
        <div className="card p-6 mb-8">
          <h2 className="font-heading font-bold text-xl mb-4">
            {editingPost ? "Edit Blog Post" : "New Blog Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="input-field"
                  placeholder="blog-post-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Delivery, Gift Ideas, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">Excerpt *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                rows={3}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                Content * (Markdown supported)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={15}
                className="input-field font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">Published Date</label>
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">Read Time (minutes)</label>
                <input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: parseInt(e.target.value, 10) || 5 })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">Blog Image *</label>
              <div className="space-y-2">
                {formData.image ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative w-16 h-16 rounded border border-brand-gray-200 overflow-hidden bg-brand-gray-100">
                      <Image src={formData.image} alt="Blog preview" fill className="object-cover" />
                    </div>
                    <input type="text" value={formData.image} readOnly className="input-field flex-1 text-xs min-w-[12rem]" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="btn-outline text-sm px-4 py-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="btn-outline text-sm disabled:opacity-50"
                >
                  {isUploading ? "Uploading…" : "+ Upload Image"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="input-field"
                placeholder="nairobi, flowers, delivery"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-medium text-brand-gray-900">
                Featured Post
              </label>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button type="submit" className="btn-primary">
                {editingPost ? "Update Post" : "Create Post"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                  resetForm();
                }}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-gray-200">
            <thead className="bg-brand-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">Featured</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-brand-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-brand-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16 overflow-hidden rounded-md">
                      <Image src={post.image} alt={post.title} fill className="object-cover" sizes="64px" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-brand-gray-900">{post.title}</div>
                    <div className="text-sm text-brand-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-brand-gray-100 text-brand-gray-800 rounded">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">
                    {format(new Date(post.published_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.featured ? (
                      <span className="px-2 py-1 text-xs font-medium bg-brand-red text-white rounded">Featured</span>
                    ) : (
                      <span className="text-brand-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="text-brand-green hover:text-brand-green/80">
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleEdit(post)}
                        disabled={loadingEditId === post.id}
                        className="text-brand-green hover:text-brand-green/80 disabled:opacity-50"
                      >
                        {loadingEditId === post.id ? "Loading…" : "Edit"}
                      </button>
                      <button type="button" onClick={() => handleDelete(post.id)} className="text-brand-red hover:text-brand-red/80">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
