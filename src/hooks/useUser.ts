import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useUser() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const registerUser = async ({
    userEmail,
    userPassword,
  }: {
    userEmail: string;
    userPassword: string;
  }) => {
    setLoading(true);

    const data = { userEmail, userPassword };

    const res = await fetch(`/api/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
    return res;
  };

  return {
    loading,
    registerUser,
  };
}
