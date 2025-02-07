"use client"
import SideBar from "@/components/admin/SideBar";
import { useGlobalContext } from "@/context/context";
import { CheckLoggedInDocument, CheckLoggedInQuery } from "@/gql/graphql";
import { SERVER_URL } from "@/lib/urql";
import { withUrqlClient } from "next-urql";
import { cacheExchange, fetchExchange, useQuery } from "urql";

 function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: user , setData : setUser } = useGlobalContext();

  const [{ fetching, data }] = useQuery<
  CheckLoggedInQuery
>({
  query: CheckLoggedInDocument,
  variables: {
  },
});

  return (
    <div className="flex w-screen  lg:h-screen  overflow-y-scroll  lg:overflow-x-hidden lg:overflow-y-hidden">
      { data?.checkLoggedIn?.roles ? 
      (
        <>
          <SideBar />
          <div className="px-6 pt-6 flex-1">{children}</div>
        </>
      ) :
      (
        <div className="flex-1">Login</div>
      )
    }
    </div>
  );
}

export default withUrqlClient(() => ({
  url: SERVER_URL,
  exchanges: [fetchExchange, cacheExchange],
  fetchOptions: {
    cache: "no-cache",
    credentials: "include",
  },
}))(RootLayout);

