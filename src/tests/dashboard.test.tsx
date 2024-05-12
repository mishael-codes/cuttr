import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/guarded/dashboard";

it("Should have Welcome Text", () => {
  render(<Dashboard />);
  const message = screen.getByText(/Welcome/i);
  expect(message).toBeVisible();
});
