import {fireEvent, render, screen } from '@testing-library/react';
import Dashboard from './pages/guarded/dashboard';
import InputLongLink from "./components/shortenInput/input"
import Footer from './components/footer';

// Welcme text is visible
it("Should have Welcome Text", () => {
  render(<Dashboard />);
  const message = screen.getByText(/Welcome/i)
  expect(message).toBeVisible()
})



// Tests the input component
describe("InputLongLink Test", () => {
  // checks if the text prop content is showing 
  it("Should always have text display", () => {
    render(<InputLongLink text='Testing'/>)
    const text = screen.getByText(/Testing/i)
    expect(text).toBeVisible()
  })

  // checks  if the input resets
  it("Should be reset", () => {
    render(<InputLongLink text='Testing'/>)
    const linkInput = screen.getByPlaceholderText('https://www.example.com')
    const linkInputValue = linkInput.textContent = "https://www.google.com"
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(linkInputValue).toBe(linkInput.textContent)
  })
})

it("Should have Redirecting Text", () => {
  render(<Footer />);
  const message = screen.getByText(/Cuttr/i)
  expect(message).toBeInTheDocument()
})