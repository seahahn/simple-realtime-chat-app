import {LoaderFunctionArgs} from "@remix-run/node";
import PageTitle from "~/components/PageTitle";
import texts from "~/constants/texts";
import {preventSignedInUser} from "~/lib/auth.server";

export async function loader({request}: LoaderFunctionArgs) {
  const checkUserSession = await preventSignedInUser(request);
  return checkUserSession;
}

export default function ResetPasswordSuccess() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageTitle titleText={texts.RESET_PASSWORD_SUCCESS_TITLE} />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center text-gray-700">
            <p className="text-lg">{texts.RESET_PASSWORD_SUCCESS_DESCRIPTION}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
