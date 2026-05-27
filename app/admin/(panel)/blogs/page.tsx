import { redirect } from "next/navigation";

/** Blog management lives in the staff panel */
export default function AdminBlogsPage() {
  redirect("/staff/content/blog");
}
