/**
 * MATHO — Shared domain entity types.
 *
 * These mirror the Prisma schema (packages/database/prisma/schema.prisma)
 * at the type level so that apps/web, apps/admin, and apps/api can share
 * a single source of truth for shapes without importing the Prisma client
 * directly into the frontend.
 *
 * Phase 1: shape only. No business logic.
 */

export type ID = string;
export type ISODateString = string;

export enum UserRole {
  BUYER = 'BUYER',
  MERCHANT = 'MERCHANT',
  CREATOR = 'CREATOR',
  AFFILIATE = 'AFFILIATE',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FULFILLED = 'FULFILLED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  PI_NETWORK = 'PI_NETWORK',
}

export enum LivestreamStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export enum NotificationType {
  ORDER = 'ORDER',
  LIVE = 'LIVE',
  COMMISSION = 'COMMISSION',
  SYSTEM = 'SYSTEM',
  FOLLOW = 'FOLLOW',
}

export interface User {
  id: ID;
  email?: string | null;
  piUid?: string | null;
  role: UserRole;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Profile {
  id: ID;
  userId: ID;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  languageCode: string;
  countryCode?: string | null;
}

export interface Store {
  id: ID;
  ownerId: ID;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  isVerified: boolean;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  parentId?: ID | null;
}

export interface ProductVariant {
  id: ID;
  productId: ID;
  sku: string;
  name: string;
  priceInPi: number;
  stock: number;
}

export interface Product {
  id: ID;
  storeId: ID;
  categoryId?: ID | null;
  title: string;
  description?: string | null;
  basePriceInPi: number;
  images: string[];
  variants?: ProductVariant[];
  isPublished: boolean;
}

export interface OrderItem {
  id: ID;
  orderId: ID;
  productId: ID;
  variantId?: ID | null;
  quantity: number;
  unitPriceInPi: number;
}

export interface Order {
  id: ID;
  buyerId: ID;
  storeId: ID;
  status: OrderStatus;
  totalInPi: number;
  items?: OrderItem[];
  createdAt: ISODateString;
}

export interface Payment {
  id: ID;
  orderId: ID;
  provider: PaymentProvider;
  status: PaymentStatus;
  amountInPi: number;
  piPaymentId?: string | null;
}

export interface Livestream {
  id: ID;
  hostId: ID;
  storeId?: ID | null;
  title: string;
  status: LivestreamStatus;
  streamProvider: string;
  streamKey?: string | null;
  playbackUrl?: string | null;
  startedAt?: ISODateString | null;
  endedAt?: ISODateString | null;
}

export interface AffiliateLink {
  id: ID;
  affiliateId: ID;
  productId: ID;
  code: string;
  clicks: number;
}

export interface Commission {
  id: ID;
  affiliateLinkId: ID;
  orderId: ID;
  amountInPi: number;
  isPaid: boolean;
}

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  body?: string | null;
  isRead: boolean;
  createdAt: ISODateString;
}

export interface Review {
  id: ID;
  productId: ID;
  authorId: ID;
  rating: number;
  comment?: string | null;
}

export interface Follow {
  id: ID;
  followerId: ID;
  followingId: ID;
}

export interface Language {
  code: string;
  name: string;
  isDefault: boolean;
}
