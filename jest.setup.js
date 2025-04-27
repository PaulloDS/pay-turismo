import "@testing-library/jest-dom";

// Mock do Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/mock-path",
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));

// Mock do next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: "mock-user-id",
        email: "test@example.com",
        role: "ADMIN",
      },
    },
    status: "authenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);
