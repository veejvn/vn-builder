export interface Project {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  status: 'Live' | 'Staging' | 'Draft';
  statusColor: 'green' | 'yellow' | 'gray';
  updated: string;
}