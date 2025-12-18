export interface User {
  id: number;
  username: string;
  displayName: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
  displayName: string;
}

export interface CoupleStatus {
  isPaired: boolean;
  coupleId: number | null;
  partnerId: number | null;
  partnerDisplayName: string | null;
  pairedAt: string | null;
}

export interface TimerData {
  pairedAt: string;
  totalSeconds: number;
}

export interface SlideshowImage {
  id: number;
  imageUrl: string;
  orderIndex: number;
  uploadedByUserId: number;
  createdAt: string;
}

export interface QuickMessage {
  id: number;
  content: string;
  createdByUserId: number;
  createdAt: string;
}

export interface PairingCode {
  code: string;
  expiresInSeconds: number;
}

