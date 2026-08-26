import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../lib/authOptions";

import {
  createWhatsAppPremierRequest,
  saveWhatsAppPremierAccess,
} from "../../../lib/userStore";

type ApiResponse =
  | {
      ok: true;
      message: string;
      pending?: boolean;
      whatsappNumber?: string;
      user?: {
        id: string;
        fullName: string;
        email: string;
        whatsappNumber?: string;
        whatsappPremierAccess?: boolean;
        whatsappPremierAccessAt?: string;
      };
    }
  | {
      ok: false;
      message: string;
    };

type SessionUserWithId = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    res.setHeader(
      "Allow",
      "POST"
    );

    return res.status(405).json({
      ok: false,
      message:
        "Method not allowed.",
    });
  }

  try {
    const session =
      await getServerSession(
        req,
        res,
        authOptions
      );

    /*
     * NextAuth's default TypeScript
     * Session user type does not include
     * our custom `id` property.
     *
     * At runtime the ID is supplied by
     * our auth configuration, so we
     * safely read it here.
     */
    const sessionUser =
      session?.user as
        | SessionUserWithId
        | undefined;

    const userId =
      typeof sessionUser?.id ===
      "string"
        ? sessionUser.id.trim()
        : "";

    const whatsappNumber =
      typeof req.body?.whatsappNumber ===
      "string"
        ? req.body.whatsappNumber.trim()
        : "";

    if (!whatsappNumber) {
      return res.status(400).json({
        ok: false,
        message:
          "WhatsApp number is required.",
      });
    }

    /*
     * User is not logged in yet.
     *
     * Save the request immediately so
     * the number is persisted in
     * users.json.
     */
    if (!userId) {
      const request =
        await createWhatsAppPremierRequest(
          whatsappNumber
        );

      if (!request.ok) {
        return res
          .status(request.status)
          .json({
            ok: false,
            message:
              request.message,
          });
      }

      return res.status(200).json({
        ok: true,

        message:
          "WhatsApp Premier Access request saved. It will be linked to your account after sign-up or login.",

        pending: true,

        whatsappNumber:
          request.request
            .whatsappNumber,
      });
    }

    /*
     * User is already authenticated.
     *
     * Save the WhatsApp number directly
     * against the logged-in account.
     */
    const result =
      await saveWhatsAppPremierAccess(
        userId,
        whatsappNumber
      );

    if (!result.ok) {
      return res
        .status(result.status)
        .json({
          ok: false,
          message:
            result.message,
        });
    }

    return res.status(200).json({
      ok: true,

      message:
        "WhatsApp Premier Access request saved.",

      user: {
        id: result.user.id,

        fullName:
          result.user.fullName,

        email:
          result.user.email,

        whatsappNumber:
          result.user.whatsappNumber,

        whatsappPremierAccess:
          result.user
            .whatsappPremierAccess,

        whatsappPremierAccessAt:
          result.user
            .whatsappPremierAccessAt,
      },
    });
  } catch (error) {
    console.error(
      "WhatsApp Premier Access error:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        "Failed to save WhatsApp Premier Access request.",
    });
  }
}