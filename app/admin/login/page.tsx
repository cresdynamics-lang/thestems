import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ next?: string }> };

/** Single sign-in lives at /staff/login */
export default async function AdminLoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const q = new URLSearchParams();
  if (next && (next.startsWith("/staff") || next.startsWith("/admin"))) {
    q.set("next", next);
  }
  const suffix = q.toString() ? `?${q.toString()}` : "";
  redirect(`/staff/login${suffix}`);
}
