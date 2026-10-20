export type SubmissionStatus = "Pending" | "Approved" | "Needs changes";

export interface Submission {
  id: string;
  name: string;
  project: string;
  category: string;
  submitted: string;
  status: SubmissionStatus;
  initials: string;
  color: string;
}

export const demoSubmissions: Submission[] = [
  { id: "CR-1048", name: "Alex Morgan", project: "Launchpad — SaaS starter", category: "Web app", submitted: "12 min ago", status: "Pending", initials: "AM", color: "peach" },
  { id: "CR-1047", name: "Priya Shah", project: "Greenhouse habit tracker", category: "Mobile app", submitted: "48 min ago", status: "Pending", initials: "PS", color: "lilac" },
  { id: "CR-1046", name: "Noah Williams", project: "Open-source icon library", category: "Open source", submitted: "2 hours ago", status: "Approved", initials: "NW", color: "blue" },
  { id: "CR-1045", name: "Mia Chen", project: "Canvas — collaborative notes", category: "Web app", submitted: "3 hours ago", status: "Needs changes", initials: "MC", color: "pink" },
  { id: "CR-1044", name: "Ethan Brooks", project: "Forecast finance dashboard", category: "Data & AI", submitted: "5 hours ago", status: "Pending", initials: "EB", color: "green" },
  { id: "CR-1043", name: "Sofia Martinez", project: "Community recipe book", category: "Web app", submitted: "Yesterday", status: "Approved", initials: "SM", color: "yellow" },
];
