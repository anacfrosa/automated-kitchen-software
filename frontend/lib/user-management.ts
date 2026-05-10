export const currentUserName = (currentRole: string): string => {
  switch (currentRole) {
    case "admin":
      return "Super Admin";
    case "handler":
      return "Food Handler";
    case "manager":
      return "Shop Manager";
    default:
      return "";
  }
};
