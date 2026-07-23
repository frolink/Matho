/**
 * Pi Network — Payments placeholder.
 *
 * Mirrors the Pi Platform payments flow (create -> approve -> complete)
 * described at https://github.com/pi-apps/pi-platform-docs. Phase 1 only
 * defines the contract; real HTTP calls to Pi's Platform API and the
 * client-side `Pi.createPayment` are implemented in a later phase.
 */

export interface CreatePiPaymentInput {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

export interface PiPayment {
  identifier: string;
  amount: number;
  status: 'created' | 'approved' | 'completed' | 'cancelled' | 'error';
  transactionId?: string;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: PiPayment) => void;
}

/** Client-side placeholder mirroring `Pi.createPayment(...)`. */
export async function createPiPayment(
  _input: CreatePiPaymentInput,
  _callbacks: PiPaymentCallbacks,
): Promise<PiPayment> {
  throw new Error('[@matho/sdk] createPiPayment() is a Phase 1 placeholder.');
}

/** Server-side placeholder for POST /v2/payments/{id}/approve. */
export async function approvePiPayment(_paymentId: string): Promise<PiPayment> {
  throw new Error('[@matho/sdk] approvePiPayment() is a Phase 1 placeholder.');
}

/** Server-side placeholder for POST /v2/payments/{id}/complete. */
export async function completePiPayment(_paymentId: string, _txid: string): Promise<PiPayment> {
  throw new Error('[@matho/sdk] completePiPayment() is a Phase 1 placeholder.');
}
