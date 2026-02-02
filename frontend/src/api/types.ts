export type ApiResponseType<ErrorT, DetailsT> = {
  message: string;
  success: boolean;
  error?: ErrorT;
  details?: DetailsT;
};

export type signUpResponseType = ApiResponseType<unknown, unknown>;

export type signInResponseType = ApiResponseType<unknown, unknown>;

export type currentUserType = {
  currentWorkspace: {
    name: string;
    id: string;
    description: string | null;
    inviteCode: string;
    ownerId: string;
  } | null;
} & {
  name: string;
  email: string;
  profilePicture: string | null;
  currentWorkspaceId: string | null;
};

export type getCurrentUserResponseType = ApiResponseType<
  unknown,
  currentUserType
>;
