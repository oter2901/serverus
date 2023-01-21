export interface Profile {
  id: string;
  name?: string;
  type?: string; // profile type enum table
  last_name?: string;
  avatar_url?: string;
  roles: string[];

  created_at: Date;
  updated_at?: Date;
  deletedAt?: Date;
}
