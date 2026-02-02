import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ListTodo, Users, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="text-2xl font-bold text-violet-600">
          ProManSys
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/sign-in">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-violet-700 cursor-pointer"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button className="bg-violet-600 hover:bg-violet-700 cursor-pointer">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center py-16 px-6 bg-white">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Simple Project Management
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Workspaces. Projects. Tasks. Teams. Everything you need to get work
            done — nothing more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/sign-up">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 gap-2 cursor-pointer"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            What you can do with ProManSys
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-6 w-6 text-violet-600" />
                  <CardTitle>Workspaces</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-gray-600">
                Separate personal projects from team work. Switch between them
                easily.
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <ListTodo className="h-6 w-6 text-violet-600" />
                  <CardTitle>Projects & Tasks</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-gray-600">
                Create projects, add tasks with status, due dates, and
                assignees.
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-violet-600" />
                  <CardTitle>Teams & Invites</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-gray-600">
                Invite people with a simple code. Manage members and
                permissions.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t py-6 px-6 mt-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div className="w-full flex items-center gap-6 justify-between">
            <p className="mt-4 sm:mt-0">
              © {new Date().getFullYear()} ProManSys. All rights reserved.
            </p>
            <Link to="https://github.com/sathwik49/project-management">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 cursor-pointer"
              >
                <FaGithub className="h-4 w-4" />
                GitHub
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
