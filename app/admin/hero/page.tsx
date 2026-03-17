"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminHeroPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    cta_text: "",
    cta_link: "",
    sort_order: 1,
    is_active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchSlides = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await axios.get("/api/admin/hero", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlides(res.data);
    } catch (error) {
      console.error("Error fetching hero slides", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      image_url: "",
      cta_text: "",
      cta_link: "",
      sort_order: 1,
      is_active: true,
    });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      if (editing) {
        await axios.put(
          `/api/admin/hero/${editing.id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "/api/admin/hero",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      resetForm();
      fetchSlides();
    } catch (error: any) {
      console.error("Error saving hero slide", error);
      alert(error.response?.data?.message || "Failed to save hero slide");
    }
  };

  const handleHeroImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const token = localStorage.getItem("admin_token");
    if (!token) {
      alert("Please log in again to upload images.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "hero");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data?.url) {
        throw new Error(data?.message || "Failed to upload hero image.");
      }

      setForm((prev) => ({
        ...prev,
        image_url: data.url as string,
      }));
    } catch (error: any) {
      console.error("Hero image upload error:", error);
      alert(error.message || "Failed to upload hero image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.image_url,
      cta_text: slide.cta_text,
      cta_link: slide.cta_link,
      sort_order: slide.sort_order,
      is_active: slide.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero slide?")) return;
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      await axios.delete(`/api/admin/hero/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlides();
    } catch (error) {
      console.error("Error deleting slide", error);
      alert("Failed to delete hero slide");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-brand-gray-600">Loading hero settings...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900">
          Homepage Hero Section
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-5 md:p-6">
          <h2 className="font-heading font-semibold text-lg mb-4">
            {editing ? "Edit Slide" : "Add New Slide"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                Subtitle *
              </label>
              <textarea
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                required
                rows={3}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                Background Image *
              </label>
              <div className="space-y-2">
                {form.image_url && (
                  <p className="text-xs text-brand-gray-600 break-all">
                    Current image: <span className="font-mono">{form.image_url}</span>
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="block w-full text-sm text-brand-gray-700"
                  disabled={isUploading}
                />
                <p className="text-[11px] text-brand-gray-500">
                  Choose an image from your phone or laptop. It will be uploaded and linked to this slide automatically.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                  CTA Text
                </label>
                <input
                  type="text"
                  value={form.cta_text}
                  onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                  className="input-field"
                  placeholder="Shop Now"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                  CTA Link
                </label>
                <input
                  type="text"
                  value={form.cta_link}
                  onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                  className="input-field"
                  placeholder="/collections"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: parseInt(e.target.value || "1", 10) })
                  }
                  className="input-field"
                  min={1}
                />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-brand-gray-900">
                  Active slide
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm">
                {editing ? "Update Slide" : "Create Slide"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="card p-5 md:p-6">
          <h2 className="font-heading font-semibold text-lg mb-4">
            Current Slides
          </h2>
          {slides.length === 0 ? (
            <p className="text-sm text-brand-gray-600">
              No hero slides yet. Create your first slide on the left.
            </p>
          ) : (
            <ul className="space-y-3">
              {slides.map((slide) => (
                <li
                  key={slide.id}
                  className="border border-brand-gray-200 rounded-lg p-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-gray-100 text-xs font-semibold text-brand-gray-700">
                        {slide.sort_order}
                      </span>
                      <span className="font-heading font-semibold text-sm text-brand-gray-900">
                        {slide.title}
                      </span>
                      {!slide.is_active && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full bg-brand-gray-100 text-brand-gray-500">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-gray-600 mb-1 line-clamp-2">
                      {slide.subtitle}
                    </p>
                    <p className="text-[11px] text-brand-gray-500">
                      {slide.image_url}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => handleEdit(slide)}
                      className="text-brand-green hover:text-brand-green/80"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(slide.id)}
                      className="text-brand-red hover:text-brand-red/80"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

