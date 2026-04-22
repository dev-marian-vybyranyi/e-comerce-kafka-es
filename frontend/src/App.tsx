import { StatCard } from "./components/ui/StatCard";

function App() {
  return (
    <>
      <StatCard
        label="Total Sales"
        value="$12,345"
        sub="+12% from last month"
      />
    </>
  );
}

export default App;
