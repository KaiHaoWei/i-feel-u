import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useRegister() {
  const [registerLoading, setRegisterLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const registerUser = async ({
    userEmail,
    userPassword,
  }: {
    userEmail: string;
    userPassword: string;
  }) => {
    setRegisterLoading(true);

    const data = { userEmail, userPassword };

    const res = await fetch(`/api/UserRegistration`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setErrorMessage(body.error);
      throw new Error(body.error);
    }

    router.refresh();
    setRegisterLoading(false);
    return res;
  };

  return {
    registerLoading,
    registerUser,
  };
}
