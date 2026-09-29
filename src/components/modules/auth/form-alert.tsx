import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/** One line above a form: what went wrong, or what just happened. */
export function FormAlert({
  message,
  tone = "error",
}: {
  message: string | null | undefined;
  tone?: "error" | "success";
}) {
  if (!message) return null;

  return (
    <Alert
      variant={tone === "error" ? "destructive" : "default"}
      role={tone === "error" ? "alert" : "status"}
    >
      {tone === "error" ? <CircleAlertIcon /> : <CircleCheckIcon />}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
