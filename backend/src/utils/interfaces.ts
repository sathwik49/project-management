export interface UserInterface {
  id: String;
  name: String;
  email: String;
  profilePicture?:String | null;
  currentWorkspaceId: String | null;
}
