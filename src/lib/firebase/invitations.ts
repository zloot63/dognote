// src/lib/firebase/invitations.ts

import {
    collection,
    doc,
    addDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    FieldValue,
    query,
    where,
    getDocs,
    deleteDoc,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase";
  import { addUserToDog } from "./dogUsers";
  import { getUserByEmail } from "./users";
  import { InvitationRead, InvitationWrite } from "@/types/invitations";
  
  /**
   * 1. 초대 or 요청 생성
   * @param inviterId    초대한(혹은 요청한) 사용자 UID
   * @param invitedEmail 초대받을(혹은 owner의) 이메일
   * @param dogId        공유하려는 강아지 ID
   * @param type         \"invite\" | \"request\"
   */
  export const sendDogShareRequest = async ({
    inviterId,
    invitedEmail,
    dogId,
    type = "request",
  }: {
    inviterId: string;
    invitedEmail: string;
    dogId: string;
    type?: "invite" | "request";
  }): Promise<string | null> => {
    try {
      // 저장 시점에는 FieldValue 사용
      const invitationData: InvitationWrite = {
        inviterId,
        invitedEmail,
        dogId,
        status: "pending",
        type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
  
      const ref = await addDoc(collection(db, "invitations"), invitationData);
      console.log(`✅ [sendDogShareRequest] ${type} created:`, ref.id);
      return ref.id;
    } catch (error) {
      console.error("🚨 [sendDogShareRequest] 실패:", error);
      return null;
    }
  };
  
  /**
   * 2. 특정 초대/요청 문서 조회 (InvitationRead 형태)
   * @param invitationId 
   */
  export const getInvitationById = async (
    invitationId: string
  ): Promise<InvitationRead | null> => {
    try {
      const snap = await getDoc(doc(db, "invitations", invitationId));
      if (!snap.exists()) return null;
  
      return {
        id: snap.id,
        ...snap.data(),
      } as InvitationRead;
    } catch (error) {
      console.error("🚨 [getInvitationById] 실패:", error);
      return null;
    }
  };
  
  /**
   * 3. 초대/요청 수락
   * - status = accepted
   * - invitedEmail -> userId 찾은 뒤 dog_users에 member로 추가
   */
  export const acceptDogShareRequest = async (invitationId: string): Promise<void> => {
    try {
      const invitation = await getInvitationById(invitationId);
      if (!invitation) {
        console.warn("[acceptDogShareRequest] 문서가 존재하지 않습니다.", invitationId);
        return;
      }
  
      // 1) status 업데이트
      await updateDoc(doc(db, "invitations", invitationId), {
        status: "accepted",
        updatedAt: serverTimestamp(),
      });
  
      // 2) invitedEmail -> userId
      const targetUser = await getUserByEmail(invitation.invitedEmail);
      if (!targetUser) {
        console.warn(`[acceptDogShareRequest] '${invitation.invitedEmail}' 사용자 없음`);
        return;
      }
  
      // 3) dog_users 에 추가 (member)
      await addUserToDog(invitation.dogId, targetUser.id, "member");
      console.log("✅ [acceptDogShareRequest] dog_users 매핑 완료:", invitationId);
    } catch (error) {
      console.error("🚨 [acceptDogShareRequest] 실패:", error);
    }
  };
  
  /**
   * 4. 초대/요청 거절
   * - status = declined
   */
  export const rejectDogShareRequest = async (invitationId: string): Promise<void> => {
    try {
      await updateDoc(doc(db, "invitations", invitationId), {
        status: "declined",
        updatedAt: serverTimestamp(),
      });
      console.log("✅ [rejectDogShareRequest] 거절 완료:", invitationId);
    } catch (error) {
      console.error("🚨 [rejectDogShareRequest] 실패:", error);
    }
  };
  
  /**
   * 5. 특정 사용자 관점으로 invitations 목록 조회
   * @param userId  : 현재 사용자 UID
   * @param userEmail : 현재 사용자 이메일 (수신 측에서 필요)
   * @param mode    : \"sent\" or \"received\"
   */
  export const listInvitationsByUser = async (
    userId: string,
    userEmail: string,
    mode: "sent" | "received"
  ): Promise<InvitationRead[]> => {
    try {
      let q;
      if (mode === "sent") {
        // 내가 보낸 요청 → inviterId == userId
        q = query(collection(db, "invitations"), where("inviterId", "==", userId));
      } else {
        // 내가 받은 요청 → invitedEmail == userEmail
        q = query(collection(db, "invitations"), where("invitedEmail", "==", userEmail));
      }
  
      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InvitationRead[];
    } catch (error) {
      console.error(`[listInvitationsByUser] ${mode} 실패:`, error);
      return [];
    }
  };
  
  /**
   * 6. 특정 dogId 관련 invitations 문서 전체 삭제 (ex: 강아지 삭제 시)
   * @param dogId 
   */
  export const deleteInvitationsByDog = async (dogId: string): Promise<void> => {
    try {
      const qDog = query(collection(db, "invitations"), where("dogId", "==", dogId));
      const snap = await getDocs(qDog);
      for (const docSnap of snap.docs) {
        await deleteDoc(docSnap.ref);
      }
      console.log("✅ [deleteInvitationsByDog] dog:", dogId, "초대/요청 모두 삭제 완료");
    } catch (error) {
      console.error("🚨 [deleteInvitationsByDog] 실패:", error);
    }
  };
  
  /**
   * 7. 특정 user가 관련된 invitations 삭제 (ex: 사용자 탈퇴 시)
   * @param userEmail (user.email)
   */
  export const deleteInvitationsByUser = async (userId: string, userEmail: string): Promise<void> => {
    try {
      const invRef = collection(db, "invitations");
  
      // 1) 사용자가 보낸(sentr) invitations
      const qSent = query(invRef, where("inviterId", "==", userId));
      const snapSent = await getDocs(qSent);
      for (const docSnap of snapSent.docs) {
        await deleteDoc(docSnap.ref);
      }
  
      // 2) 사용자가 받은(received) invitations
      const qReceived = query(invRef, where("invitedEmail", "==", userEmail));
      const snapReceived = await getDocs(qReceived);
      for (const docSnap of snapReceived.docs) {
        await deleteDoc(docSnap.ref);
      }
  
      console.log("✅ [deleteInvitationsByUser] user:", userId, "모든 초대/요청 삭제 완료");
    } catch (error) {
      console.error("🚨 [deleteInvitationsByUser] 실패:", error);
    }
  };
  