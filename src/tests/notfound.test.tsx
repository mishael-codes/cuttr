import { screen, render } from "@testing-library/react";
import NotFound from "../pages/general/notfound";
import { BrowserRouter as Router } from "react-router-dom";

it("Should show redirect to home message", () => {
  render(
    <Router>
      <NotFound />
    </Router>
  );
  const message = screen.getByText(/Redirecting to Cuttr in/i);
  expect(message).toBeVisible();
});
