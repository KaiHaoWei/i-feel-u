import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useLogin() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const loginUser = async ({
    userEmail,
    userPassword,
  }: {
    userEmail: string;
    userPassword: string;
  }) => {
    setLoginLoading(true);
    const data = { userEmail, userPassword };

    const res = await fetch(`/api/UserLoginAuthentication`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
      throw new Error(body.error);
    }

    router.refresh();
    setLoginLoading(false);
    return res;
  };

  return {
    loginLoading,
    loginUser,
  };
}
