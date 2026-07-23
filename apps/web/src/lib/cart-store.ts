import { create } from 'zustand';

/**
 * Phase 1 placeholder cart store — shape only, no checkout/business logic.
 * Wired up fully once the Orders/Payments modules are implemented.
 */
export interface CartLine {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),
  removeLine: (productId) =>
    set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
  clear: () => set({ lines: [] }),
}));
