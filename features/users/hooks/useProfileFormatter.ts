import { getFullName, getInitials, User } from "../types/users.types";
import { isDoctor } from "../types/doctors.types";

import { formatDate } from "@/shared/utils/date.utils";

export const useProfileFormatter = (user: User) => {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const doctor = isDoctor(user);
  const profile = user.doctorProfile;
  const activeClinics = profile?.doctorClinics?.filter((c) => c.isActive) ?? [];

  const createdAt = formatDate(user.createdAt);
  return {
    fullName,
    initials,
    createdAt,
    doctor,
    profile,
    activeClinics,
  };
};
