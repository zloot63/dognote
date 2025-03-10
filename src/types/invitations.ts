import { Timestamp } from "firebase/firestore";

export interface InvitationRead {
  id: string;
  inviterId: string;         // 요청 or 초대한 사용자
  invitedEmail: string;      // 초대받은 사용자 이메일
  dogId: string;             // 대상 강아지 ID
  status: "pending" | "accepted" | "declined";
  type: "invite" | "request";
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Firestore에 저장할 때 (FieldValue) 형태
 * - serverTimestamp() 등
 */
export interface InvitationWrite {
  inviterId: string;
  invitedEmail: string;
  dogId: string;
  status: "pending" | "accepted" | "declined";
  type: "invite" | "request";
  createdAt: any;    // Firestore FieldValue
  updatedAt: any;    // Firestore FieldValue
}
