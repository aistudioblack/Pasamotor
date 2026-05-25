import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";
import { HelmetProvider } from "react-helmet-async";

// dbClient mock
vi.mock("@/lib/firebase-client", () => {
  const mockChain: any = {
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn().mockImplementation((resolve) => resolve({ data: [], error: null }))
  };

  return {
    dbClient: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      },
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: { path: "test" }, error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "http://test.local" } })
        })
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue(mockChain),
        insert: vi.fn().mockReturnValue(mockChain),
        update: vi.fn().mockReturnValue(mockChain),
        delete: vi.fn().mockReturnValue(mockChain)
      }),
    }
  };
});

describe("App E2E Flow", () => {
  it("renders home page by default", async () => {
    // E2E smoke test that mounts everything
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    
    // Check if standard elements load
    await waitFor(() => {
      // Look for a link or typical wording from index
      const yedekParcalarLink = screen.queryAllByText(/Yedek Parça/i);
      expect(yedekParcalarLink.length).toBeGreaterThan(0);
    });
  });

});
