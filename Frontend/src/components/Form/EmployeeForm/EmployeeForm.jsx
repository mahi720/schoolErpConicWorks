import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

export default function EmployeeForm() {
  return (
    <div className="space-y-4">
      <Input placeholder="Employee Name" />

      <Input placeholder="Employee Id" />

      <Input placeholder="Phone Number" />

      <Input placeholder="Email" />

      <Button>Save</Button>
    </div>
  );
}
