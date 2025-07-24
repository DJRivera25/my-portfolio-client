import ProtectedRoute from "../../src/components/ProtectedRoute";
import Inbox from "../../src/pages/Inbox";

export default function InboxPage() {
  return (
    <ProtectedRoute>
      <Inbox />
    </ProtectedRoute>
  );
}
