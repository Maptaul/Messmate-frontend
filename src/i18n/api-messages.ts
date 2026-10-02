import type { MessageKey } from "./translate";

/**
 * The API answers in English. Messages users actually hit get a translation;
 * anything not listed is shown as the API wrote it.
 */
const API_MESSAGE_KEYS: Record<string, MessageKey> = {
  "Invalid Credentials": "errors.api.invalidCredentials",
  "User Not Found": "errors.api.userNotFound",
  "User Does Not Exist!": "errors.api.userNotFound",
  "User Is Blocked": "errors.api.userBlocked",
  "User Is Deleted": "errors.api.userDeleted",
  "OTP Does Not Match": "errors.api.otpMismatch",
  "Email Already Verified": "errors.api.emailAlreadyVerified",
  "Too many requests. Please try again later.": "errors.api.tooManyRequests",
  "Too many authentication attempts. Please try again later.":
    "errors.api.tooManyRequests",
  "User not found. Please log in again.": "errors.api.sessionExpired",
  "You Already Have A Request Waiting For Review": "errors.api.requestPending",
  "This Request Has Already Been Reviewed": "errors.api.requestReviewed",
  "Manager Request Not Found": "errors.api.requestNotFound",
  "You Already Manage A Mess": "errors.api.alreadyManageMess",
  "No Mess Has This Join Code": "errors.api.joinCodeNotFound",
  "You Already Asked To Join This Mess": "errors.api.alreadyAsked",
  "You Have An Invitation To This Mess. Accept It Instead.":
    "errors.api.acceptInvitation",
  "You Are Already A Member Of This Mess": "errors.api.alreadyMember",
  "They Already Asked To Join. Approve Their Request Instead.":
    "errors.api.theyAsked",
  "This Person Already Has An Invitation": "errors.api.alreadyInvited",
  "Reopen The Newest Closed Month First": "errors.api.reopenNewestFirst",
  "This User Is Already An Active Member Of This Mess":
    "errors.api.alreadyActiveMember",
  "No User Found With This Email. Ask Them To Register First.":
    "errors.api.noUserWithEmail",
  "A Mess Manager Runs Their Own Mess And Cannot Join Another":
    "errors.api.managerCannotJoin",
  "This Invitation Or Request Was Already Answered":
    "errors.api.alreadyAnswered",
  "A Manager Cannot Leave Their Own Mess": "errors.api.managerCannotLeave",
};

export const apiMessageKey = (message: string): MessageKey | undefined =>
  API_MESSAGE_KEYS[message];
