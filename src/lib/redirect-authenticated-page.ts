import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "./authOptions";
import { normalizeCallbackUrl } from "./public-entry";

export const redirectAuthenticatedUserFromPublicPage: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: normalizeCallbackUrl(context.query.callbackUrl, "/dashboard"),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
