export interface UserInterface {
  id: string;
  name: string;
  email: string;
  profilePicture?:string | null;
  currentWorkspaceId: string | null;
}
