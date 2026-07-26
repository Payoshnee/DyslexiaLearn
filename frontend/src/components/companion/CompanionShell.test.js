import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { CompanionProvider } from "../../companion/CompanionProvider";
import CompanionErrorBoundary from "./CompanionErrorBoundary";
import CompanionShell from "./CompanionShell";

function BrokenChild() {
  throw new Error("Boom");
}

describe("CompanionShell", () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  test("hidden companion is not rendered when feature flag is disabled", () => {
    render(
      <CompanionProvider>
        <CompanionShell />
      </CompanionProvider>
    );

    expect(screen.queryByLabelText("Learning companion")).not.toBeInTheDocument();
  });

  test("companion error fallback appears when a child throws", () => {
    render(
      <CompanionErrorBoundary>
        <BrokenChild />
      </CompanionErrorBoundary>
    );

    expect(
      screen.getByText("The learning companion is temporarily unavailable.")
    ).toBeInTheDocument();
    expect(screen.getByText("You can continue the lesson normally.")).toBeInTheDocument();
  });
});
