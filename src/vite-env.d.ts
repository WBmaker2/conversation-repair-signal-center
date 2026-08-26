/// <reference types="vite/client" />

declare module 'jest-axe' {
  export function axe(container: Element): Promise<{ violations: readonly unknown[] }>;
}
