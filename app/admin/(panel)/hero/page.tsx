import { redirect } from "next/navigation";

/** Homepage hero management lives in the staff panel */
export default function AdminHeroPage() {
  redirect("/staff/content/banners");
}
