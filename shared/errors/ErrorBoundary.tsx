import { Component } from "react";
import type { ReactNode } from "react";

type ErrorBoundaryState = {
  error: ReactNode | null;
};

function getErrorText(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }
  return String(error);
}

// NOTE: Once you get Clerk working you can remove this error boundary
export class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const errorText = getErrorText(error);
    if (
      errorText.includes("@clerk/clerk-react") &&
      errorText.includes("publishableKey")
    ) {
      const [clerkDashboardUrl] = errorText.match(/https:\S+/) ?? [];
      return {
        error: (
          <>
            <p>
              Add{" "}
              <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={'"<your publishable key>"'}
              </code>{" "}
              to the{" "}
              <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
                .env.local
              </code>{" "}
              file
            </p>
            {clerkDashboardUrl ? (
              <p>
                You can find it at{" "}
                <a
                  href={clerkDashboardUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary underline underline-offset-4 hover:no-underline"
                >
                  {clerkDashboardUrl}
                </a>
              </p>
            ) : null}
            <p className="pl-8 text-muted-foreground">Raw error: {errorText}</p>
          </>
        ),
      };
    }

    // propagate error to Next.js provided error boundary
    throw error;
  }

  render() {
    if (this.state.error !== null) {
      return (
        <div className="bg-destructive/30 p-8 flex flex-col gap-4 container">
          <h1 className="text-xl font-bold">
            Caught an error while rendering:
          </h1>
          {this.state.error}
        </div>
      );
    }

    return this.props.children;
  }
}
