"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import api, { isAxiosError } from "../lib/api/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type UseContactFormSubmissionOptions = {
  onSuccess?: () => void;
};

export function useContactFormSubmission(options?: UseContactFormSubmissionOptions) {
  const { isLoggedIn, fetchUnseenCount } = useAuth();
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [sending, setSending] = useState(false);
  const onSuccessRef = useRef(options?.onSuccess);
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
  });

  const handleFieldChange = useCallback((field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      setSending(true);
      try {
        await api.post("/api/messages", form);
        toast.success("Message sent successfully!");
        setForm(initialForm);
        if (isLoggedIn) {
          await fetchUnseenCount();
        }
        onSuccessRef.current?.();
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 429) {
          const msg =
            typeof err.response.data === "object" && err.response.data && "message" in err.response.data
              ? String((err.response.data as { message?: string }).message)
              : "You are sending messages too quickly. Please wait and try again.";
          toast.error(msg);
        } else {
          toast.error("Something went wrong. Try again.");
        }
        console.error("Error sending message:", err);
      } finally {
        setSending(false);
      }
    },
    [form, isLoggedIn, fetchUnseenCount]
  );

  return { form, setForm, sending, handleSubmit, handleFieldChange };
}
