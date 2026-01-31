export interface Project {
  id: string;
  name: string;
  description?: string; // Added description
  url: string;
  thumbnail: string;
  status: 'Live' | 'Staging' | 'Draft';
  statusColor: 'green' | 'yellow' | 'gray';
  updated: string;
}
