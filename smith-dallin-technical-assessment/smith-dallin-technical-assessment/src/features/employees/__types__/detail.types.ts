import { Employee } from "./index";

export type AvatarUploadProps = {
  currentAvatarUrl?: string;
  firstName: string;
  lastName: string;
  onUpload: (imageUrl: string) => Promise<unknown>;
  inactive?: boolean;
};

export type EmployeeHeaderProps = {
  employee: Employee;
  onAvatarUpload: (imageUrl: string) => Promise<unknown>;
};

export type EmployeeInfoProps = {
  employee: Employee;
};
