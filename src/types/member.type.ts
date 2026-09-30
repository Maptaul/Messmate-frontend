import type { ListParams, Money } from "./api.type";
import type { MembershipStatus } from "./user.type";

export interface MessMember {
  /** The MessMember id — what every member-scoped endpoint takes. */
  id: string;
  status: MembershipStatus;
  joinedAt: string;
  leftAt: string | null;
  defaultLunch: number;
  defaultDinner: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  };
  mess: { id: string; name: string };
}

export interface MyMembership extends Omit<MessMember, "mess"> {
  mess: { id: string; name: string; address: string; monthlyRent: Money };
}

export interface MemberListParams extends ListParams {
  status?: MembershipStatus;
}

export interface AddMemberPayload {
  messId: string;
  email: string;
}
