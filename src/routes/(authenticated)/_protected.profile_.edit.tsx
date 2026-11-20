import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "@/pages/account/edit-profile-page";
export const Route = createFileRoute("/(authenticated)/_protected/profile_/edit")({ component: EditProfilePage });
