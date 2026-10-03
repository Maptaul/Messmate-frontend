import type { ListParams } from "./api.type";

export type MembershipRequestKind = "INVITE" | "REQUEST";

export type MembershipRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELLED";

export interface MessPreview {
  id: string;
  name: string;
  address: string;
  manager: { name: string };
  _count?: { members: number };
}

export interface MyMembershipRequest {
  id: string;
  kind: MembershipRequestKind;
  status: MembershipRequestStatus;
  note: string | null;
  createdAt: string;
  mess: MessPreview;
}

/**
 * A manager's view. An invitation carries only the email they typed until it
 * is accepted, so the other user fields are optional.
 */
export interface MessMembershipRequest extends MyMembershipRequest {
  decidedAt: string | null;
  user: {
    email: string;
    id?: string;
    name?: string;
    phone?: string | null;
    avatarUrl?: string | null;
  };
}

export interface MessMembershipParams extends ListParams {
  status?: MembershipRequestStatus;
  kind?: MembershipRequestKind;
}

export interface InviteMemberPayload {
  messId: string;
  email: string;
}

export interface RequestToJoinPayload {
  joinCode: string;
  note?: string;
}
