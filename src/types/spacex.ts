export interface Launch {
  id: string;
  flight_number: number;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  date_precision: string;
  static_fire_date_utc?: string;
  static_fire_date_unix?: number;
  tdb?: boolean;
  net?: boolean;
  window?: number;
  rocket?: string;
  success?: boolean;
  failures: unknown[];
  upcoming: boolean;
  details?: string;
  crew: string[];
  ships: string[];
  capsules: string[];
  payloads: string[];
  launchpad: string;
  auto_update: boolean;
  launch_library_id?: string;
  links: LaunchLinks;
  cores: Core[];
}

export interface LaunchLinks {
  patch: LaunchPatch;
  presskit?: string;
  webcast?: string;
  youtube_id?: string;
  article?: string;
  wikipedia?: string;
}

export interface LaunchPatch {
  small?: string;
  large?: string;
}

export interface Core {
  core?: string;
  flight?: number;
  gridfins?: boolean;
  legs?: boolean;
  reused?: boolean;
  landing_attempt?: boolean;
  landing_success?: boolean;
  landing_type?: string;
  landpad?: string;
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  status: string;
}
