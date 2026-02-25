export interface Invitation {
  id: string;
  inviterId: string;
  invitedEmail: string;
  dogId: string;
  status: 'pending' | 'accepted' | 'declined';
  type: 'invite' | 'request';
  createdAt: string | Date;
  updatedAt?: string | Date;
}

// Legacy aliases
export type InvitationRead = Invitation;
export type InvitationWrite = Omit<Invitation, 'id'>;
