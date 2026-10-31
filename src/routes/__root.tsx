import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { TmdbAttribution } from "../components/layout/tmdb-attribution";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TmdbAttribution />
    </>
  ),
});
