import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "../pages/account/edit-profile-page";
export const Route = createFileRoute("/profile/edit")({ component: EditProfilePage });
