export interface Helper {
  _id?: string;
  id: number;
  occupation: string;
  organisationName: string;
  fullname: string;
  languages: string[];
  gender: string;
  phone: string;
  email: string;
  vehicleType: string;
  JoinedOn?: Date | null;
  households?: number;
  image?: File | string | null;
  pdf?: File | string | null;
  additionalDocument?: File | string | null;
}
