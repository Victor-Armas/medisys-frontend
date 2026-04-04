import { getFullName, getInitials, User } from "../types/users.types";
import { isDoctor } from "../types/doctors.types";

export const useProfileFormatter = (user: User) => {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const doctor = isDoctor(user);
  const profile = user.doctorProfile;
  const activeClinics = profile?.doctorClinics?.filter((c) => c.isActive) ?? [];

  const createdAt = new Date(user.createdAt).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return {
    fullName,
    initials,
    createdAt,
    doctor,
    profile,
    activeClinics,
  };
};
