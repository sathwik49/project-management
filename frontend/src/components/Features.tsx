import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ListTodo, Users } from "lucide-react";

const featureList = [
  {
    title: "Workspaces",
    desc: "Separate personal projects from team work. Switch between them easily.",
    icon: FolderKanban,
  },
  {
    title: "Projects & Tasks",
    desc: "Create projects, add tasks with status, due dates, and assignees.",
    icon: ListTodo,
  },
  {
    title: "Teams & Invites",
    desc: "Invite people with a simple code. Manage members and permissions.",
    icon: Users,
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What you can do with ProManSys
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureList.map((item, index) => (
            <Card
              key={index}
              className="border-none shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <item.icon className="h-6 w-6 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-gray-600 leading-relaxed">
                {item.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
