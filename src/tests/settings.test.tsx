import {screen, render} from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom";
import Settings from "../pages/guarded/settings";
import userEvent from "@testing-library/user-event";
import auth from "../firebase/auth";

it("Should sign out user", async () => {
  render(
    <Router>
      <Settings />
    </Router>
  );

  const signOutBtn = screen.getByRole("button", {name: /sign out/i})
  vi.spyOn(auth, "signOut").mockResolvedValue()
  await userEvent.click(signOutBtn)
  expect(window.location.pathname).toBe("/signin");
});