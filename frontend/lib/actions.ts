"use server";

import { revalidatePath } from "next/cache";

export async function toggleFavoriteProperty(id: number | string) {
  // For now, favorites are client-side only. 
  // This can later be connected to a user favorites collection.
  revalidatePath("/");
  revalidatePath("/properties/[id]", "page");
  return { success: true };
}

export async function submitBooking(formData: FormData) {
  // This is now handled client-side via the BookingForm component
  // which calls the backend API directly with the Firebase token.
  // Keeping this as a stub for any server-side fallback.
  return { success: true, bookingId: "BOK-" + Math.floor(Math.random() * 10000) };
}
