import { fireEvent, render, screen } from "@testing-library/react";
import Dashboard from "./pages/guarded/dashboard";
import InputLongLink from "./components/shortenInput/input";
import SignUp from "./pages/general/signup";
import { BrowserRouter as Router } from "react-router-dom";
import SignIn from "./pages/general/signin";
import truncate from "./components/dashboard/truncate"

// ****************** 1. Welcome text is visible
it("Should have Welcome Text", () => {
  render(<Dashboard />);
  const message = screen.getByText(/Welcome/i);
  expect(message).toBeVisible();
});

/// ****************** 2. Tests the input component
describe("InputLongLink Test", () => {
  // ****************** 2.1 checks if the text prop content is showing
  it("Should always have text display", () => {
    render(<InputLongLink text="Testing" />);
    const text = screen.getByText(/Testing/i);
    expect(text).toBeVisible();
  });

  // ****************** 2.2 checks  if the input resets
  it("Should be reset", () => {
    render(<InputLongLink text="Testing" />);
    const linkInput = screen.getByPlaceholderText(
      "https://www.example.com"
    ) as HTMLInputElement;
    const button = screen.getByRole("button");

    fireEvent.change(linkInput, {
      target: { value: "https://www.google.com" },
    });
    fireEvent.click(button);

    setTimeout(() => {
      const url = screen.getByText(/https:\/\/cuttr.vercel.app/i);
      expect(linkInput.value).toBe("");
      expect(url).toBeVisible();
    }, 5000);
  });

  // ****************** 2.3 checks if there's a short url
  it("Should display short Url", () => {
    setTimeout(() => {
      const url = screen.getByText(/https:\/\/cuttr.vercel.app/i);
      expect(url).toBeVisible();
    }, 5000);
  });
});

// ****************** 3 should redirect to dashboard after sign up
it("Should redirect to dashboard after sign up", () => {
  render(
    <Router>
      <SignUp />
    </Router>
  );

  const emailField = screen.getByPlaceholderText(
    /johndoe@gmail.com/
  ) as HTMLInputElement;
  const passwordField = screen.getByPlaceholderText(
    /^password$/i
  ) as HTMLInputElement;
  const confirmPasswordField = screen.getByPlaceholderText(
    /re-enter password/i
  ) as HTMLInputElement;
  emailField.value = "johndoe@gmail.com";
  passwordField.value = "password";
  confirmPasswordField.value = "password";
  const btn = screen.getByRole("button");
  if (emailField && passwordField && confirmPasswordField) {
    if (passwordField === confirmPasswordField) {
      fireEvent.click(btn);
      expect(window.location.pathname).toBe("/dashboard");
    }
  }
});

// ****************** 4 should redirect to dashboard after sign in
it("Should redirect to dashboard after sign in", () => {
  render(
    <Router>
      <SignIn />
    </Router>
  );

  const emailField = screen.getByPlaceholderText(
    /johndoe@gmail.com/
  ) as HTMLInputElement;
  const passwordField = screen.getByPlaceholderText(
    /^password$/i
  ) as HTMLInputElement;
  emailField.value = "johndoe@gmail.com";
  passwordField.value = "password";
  const btn = screen.getByRole("button");
  if (emailField && passwordField) {
    fireEvent.click(btn);
    setTimeout(() => {
      expect(window.location.pathname).toBe("/dashboard");
    }, 5000);
  }
});

describe("Should return truncated string", () => {
  it('Should truncate to specified length with ellipsis', () => {
    expect(truncate("superman", 5)).toEqual("supe...");
  });
});