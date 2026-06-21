import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Search Function

export function searchItems(data: any[], search: string) {
  if (!search) return data;

  return data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()),
  );
}

// Sort Function

export function sortItems(data: any[], key: string, direction: string) {
  if (!key) return data;

  return [...data].sort((a, b) => {
    if (a[key] < b[key]) {
      return direction === "asc" ? -1 : 1;
    }

    if (a[key] > b[key]) {
      return direction === "asc" ? 1 : -1;
    }

    return 0;
  });
}

// Pagination Function

export function paginateItems(data: any[], page: number, limit: number) {
  const start = (page - 1) * limit;

  return data.slice(start, start + limit);
}

// Total Pages

export function getTotalPages(data: any[], limit: number) {
  return Math.ceil(data.length / limit);
}
