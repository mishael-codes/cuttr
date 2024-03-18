import { fireEvent, render, screen } from "@testing-library/react";
import InputLongLink from "../components/shortenInput/input";

describe("InputLongLink Test", () => {
  it("Should always have text display", () => {
    render(<InputLongLink text="Testing" />);
    const text = screen.getByText(/Testing/i);
    expect(text).toBeVisible();
  });

  it("Should update the input field with the entered long link", async () => {
    render(<InputLongLink text="Testing" />);
    const linkInput = screen.getByPlaceholderText(
      "https://www.example.com"
    ) as HTMLInputElement;

    fireEvent.change(linkInput, {
      target: { value: "https://www.google.com" },
    });

    expect(linkInput.value).toBe("https://www.google.com");
  });
});
