interface DashboardWelcomeProps {
  userName?: string;
  workspaceName?: string;
}

export default function DashboardWelcome({
  userName,
  workspaceName,
}: DashboardWelcomeProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}!
      </h1>
      <p className="text-gray-600 mt-1">
        {workspaceName
          ? `Working in ${workspaceName}`
          : "Select or create a workspace to get started"}
      </p>
    </div>
  );
}
