import { useState, useMemo } from "react";
import { TabFilter, User } from "../types";

export function useUserFilters(users: User[]) {
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = users;
    if (tab !== "all") list = list.filter((u) => u.role === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastNamePaternal.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, tab, search]);

  return { tab, setTab, search, setSearch, filtered };
}
