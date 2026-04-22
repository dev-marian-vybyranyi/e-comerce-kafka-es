import { StatusBadge } from "./components/ui/StatusBadge";

function App() {
  return (
    <>
      <StatusBadge status="PENDING" />
      <StatusBadge status="PREPARING" />
      <StatusBadge status="SHIPPED" />
      <StatusBadge status="DELIVERED" />
      <StatusBadge status="PAYMENT_FAILED" />
    </>
  );
}

export default App;
