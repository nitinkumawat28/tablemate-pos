import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    return;
  }

  // extract headers
  const headers = Object.keys(data[0]);

  // create csv content
  const csvContent = [
    headers.join(','), // header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // handle strings with commas or quotes
        const stringValue = String(value === null || value === undefined ? '' : value);
        const escaped = stringValue.replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  // create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
