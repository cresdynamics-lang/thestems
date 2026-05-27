import { redirect } from "next/navigation";

/** Old URL — redirect to fresh route (avoids stale browser cache on /staff/content/blog) */
export default function LegacyStaffBlogRedirect() {
  redirect("/staff/blogs");
}
