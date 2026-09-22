import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { createProjectWorkspaceHandler } from "@npmaccount990/project-workspace/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const workspaceHandler = createProjectWorkspaceHandler({
  dataDirectory:
    process.env.PROJECT_WORKSPACE_DATA_DIR ||
    ".data/project-workspace",

  apiBasePath: "/api/project-workspace",

  getIdentity: async (request) => {
    const cookie = request.headers.get("cookie") || "";

    const token = await getToken({
      req: {
        headers: {
          cookie,
        },
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.id) {
      return null;
    }

    return {
      userId: String(token.id),
      tenantId: "skillwave",
      canManageRepositories: true,
    };
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const protocol =
      (req.headers["x-forwarded-proto"] as string) ||
      (process.env.NODE_ENV === "production" ? "https" : "http");

    const host =
      (req.headers.host as string) ||
      new URL(
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      ).host;

    const url = `${protocol}://${host}${
      req.url || "/api/project-workspace"
    }`;

    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        headers.set(key, value.join(", "));
      }
    }

    const body =
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];

            req.on("data", (chunk) => {
              chunks.push(Buffer.from(chunk));
            });

            req.on("end", () => {
              resolve(Buffer.concat(chunks));
            });

            req.on("error", reject);
          });

    const request = new Request(url, {
      method: req.method || "GET",
      headers,
      body: body && body.length > 0 ? body : undefined,
    });

    const response = await workspaceHandler(request);

    res.statusCode = response.status;

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseBody = Buffer.from(
      await response.arrayBuffer()
    );

    res.end(responseBody);
  } catch (error) {
    console.error("Project Workspace API error:", error);

    res.status(500).json({
      error: "Project Workspace request failed",
    });
  }
}

