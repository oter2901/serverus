export interface Account {
  id: number;
  email: string;
  password?: string;
  external_type?: string;
  external_id?: string;
  status: string;
  roles: string[];
  sessions?: string[];

  created_at: string;
  updated_at?: string;
  delete_at?: string;
}

// interface Account2 {
//   id: string; //Required
//   email: string;
//   password: string;
//   external_type: string; //relation with auth types tyble?
//   external_id: string;
//   status: enum; // status enum model
//   roles: Model; // reference to roles table account may have one role for many profiles
//   sessions: string; // reference to model session or ephemeral data on redis
//   // timestamps
//   created_at: Date;
//   updated_at: Date;
// }

// interface account_role {
//   id: string;
//   account: Model; //reference to account table
//   profiles: Model[]; // reference to profile table
//   role: enum; //roles enum table for roles
//   // timestamps
//   created_at: Date;
//   updated_at: Date;
// }

// ORGANIZATION AND END USERS PROFILE DATA
// interface Profile {
//   id: string;
//   name: string;
//   type: enum; // profile type enum table
//   last_name?: string;
//   avatar_url: string;
//   created_at: Date;
//   updated_at: Date;
// }
