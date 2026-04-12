import { revalidatePath } from "next/cache";

/** Call after any admin save or publish to update all affected public pages. */
export function revalidateGuide(slug: string) {
  revalidatePath(`/guides/${slug}`);
  revalidatePath("/guides");
  revalidatePath("/");
}
