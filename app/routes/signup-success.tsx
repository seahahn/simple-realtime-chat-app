import {LoaderFunctionArgs} from "@remix-run/node";
import {Link} from "@remix-run/react";
import PageTitle from "~/components/PageTitle";
import texts from "~/constants/texts";
import {preventSignedInUser} from "~/lib/auth.server";

export async function loader({request}: LoaderFunctionArgs) {
  const checkUserSession = await preventSignedInUser(request);
  return checkUserSession;
}

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageTitle titleText={texts.SIGN_UP_SUCCESS_TITLE} />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center text-green-600 font-semibold">
            {texts.SIGN_UP_SUCCESS_DESCRIPTION}
          </div>
          <div className="mt-6">
            <Link
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              to="/signin">
              {texts.SIGN_IN}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
