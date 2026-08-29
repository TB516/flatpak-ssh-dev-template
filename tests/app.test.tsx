import { rootElement } from "@gtkx/react";
import { render, screen } from "@gtkx/testing";
import { describe, expect, it } from "vitest";
import App from "../src/app.js";

describe("App", () => {
  it("renders the starter message", async () => {
    await render(<App />, { container: rootElement });
    const label = await screen.findByText("Hello from GTKX");
    expect(label).toBeDefined();
  });
});
