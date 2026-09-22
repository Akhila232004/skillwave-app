import { createElement, useEffect, useRef } from "react";
import { useProtectedAppSession } from "../lib/app-session";

export default function WorkspacePage() {
  const session = useProtectedAppSession();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    import("@npmaccount990/project-workspace/web-component");
  }, []);

  if (session.status !== "authenticated") {
    return <div style={{ minHeight: "100vh" }} />;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {createElement("project-workspace", {
        "api-base-path": "/api/project-workspace",
        "storage-key": "workspace:shared",
        "can-manage-repositories": "",
        "poll-interval-ms": "300000",
      })}
    </div>
  );
}
