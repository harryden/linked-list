import type { AttendanceRecord } from "@/hooks/useAttendances";
import { format } from "date-fns";

export const downloadCSV = (filename: string, csvData: string) => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }
};

const sanitizeCSV = (value: string | null | undefined): string => {
  if (!value) return "";
  const str = String(value);
  // Prevent CSV/Excel formula injection (DDE)
  if (["=", "+", "-", "@"].includes(str.charAt(0))) {
    return `'${str}`;
  }
  return str;
};

export const exportAttendeesToCSV = (eventName: string, records: AttendanceRecord[]) => {
  const headers = ["Name", "Headline", "LinkedIn URL", "Check-in Date"];
  
  const rows = records.map(record => {
    const profile = record.profiles;
    if (!profile) return null;

    return [
      sanitizeCSV(profile.name),
      sanitizeCSV(profile.headline),
      profile.linkedin_id ? `https://www.linkedin.com/in/${profile.linkedin_id}` : "",
      record.created_at ? format(new Date(record.created_at), "yyyy-MM-dd HH:mm") : ""
    ];
  }).filter((row): row is string[] => row !== null);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const safeFileName = `${eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}-attendees.csv`;
  downloadCSV(safeFileName, csvContent);
};
