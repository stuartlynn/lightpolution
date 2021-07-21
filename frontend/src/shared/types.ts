export interface User{
  id:number,
  login: string,
  dname: string,
  scope: string[],
  admin: boolean,
}

export interface UserToken{
  data: User,
  exp: number,
  iss: string,
  rng: number
}

export interface Annotation {
  id: string;
}

export interface Classification {
  annotations: Annotation[];
  subjectId: string;
}

export interface Subject {
  metadata: SubjectMeta;
  id: string;
  locations: any[];
  zooniverse_id?: string;
  created_at: Date;
  updated_at: Date;
  hred: string;
  selected_at: Date;
  retired: boolean;
  already_seen: boolean;
  finished_workflow: boolean;
  user_has_finished_workflow: boolean;
  favorite: boolean;
  selection_state: string;
}

export interface SubjectMeta {
  x: number;
  y: number;
  id: number;
  lat: number;
  lng: number;
  mag: number;
  sky: number;
  flux: number;
  npix: number;
  peak: number;
  sharpness: number;
  xcentroid: number;
  ycentroid: number;
  roundness1: number;
  roundness2: -0.8614969207745633;
}

