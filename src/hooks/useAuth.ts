import { useSession } from "@/context/AuthContext";

export const useAuth = () => {
  const { session } = useSession();
  const token = session;

  return {
    token,
  };
};
