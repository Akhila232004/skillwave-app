import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

import { authOptions } from "./authOptions";
import { buildPublicEntryUrl } from "./public-entry";

type ProtectedPageProps = {
  session: Session;
};

const toSerializableSession = (session: Session): Session =>
  JSON.parse(JSON.stringify(session)) as Session;

export const requireAuthenticatedPage: GetServerSideProps<ProtectedPageProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    const callbackUrl = context.resolvedUrl || "/dashboard";

    return {
      redirect: {
        destination: buildPublicEntryUrl(callbackUrl),
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: toSerializableSession(session),
    },
  };
};
