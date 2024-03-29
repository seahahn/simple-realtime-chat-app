import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {Form, Link, useActionData, useSearchParams} from "@remix-run/react";
import FormButton from "~/components/FormButton";
import FormCheckbox from "~/components/FormCheckbox";
import FormInput from "~/components/FormInput";
import FormWarningText from "~/components/FormWarningText";
import PageTitle from "~/components/PageTitle";
import texts from "~/constants/texts";
import {createUserSession, preventSignedInUser, signIn} from "~/lib/auth.server";
import {badRequest, validateUrl} from "~/lib/utils";

export async function loader({request}: LoaderFunctionArgs) {
  const checkUserSession = await preventSignedInUser(request);
  return checkUserSession;
}

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const remember = !!formData.get("remember-me");
  const url = String(formData.get("redirect-to"));
  const redirectTo = validateUrl(String(formData.get("redirect-to")) || "/");
  console.log("redirectTo", url, redirectTo);

  const errors: {formError?: string} = {};

  // Request to sign in with the email and password
  // and get the session data from the server
  const user = await signIn({email, password});
  if (!user) {
    errors.formError = "Invalid email or password";
    return badRequest({errors});
  }

  return createUserSession(user.id, remember, redirectTo);
};

export default function SignIn() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageTitle titleText={texts.SIGN_IN} />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form className="space-y-6" method="post">
            <FormInput
              labelText="Email address"
              autoComplete="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              type="email"
            />
            <FormInput
              labelText="Password"
              id="password"
              name="password"
              placeholder="Password"
              required
              type="password"
            />
            {actionData?.errors?.formError ? (
              <FormWarningText warningText={actionData?.errors.formError} />
            ) : null}
            <FormCheckbox labelText="Remember me" id="remember-me" name="remember-me" />
            <FormButton buttonText={texts.SIGN_IN} />
            <div className="flex space-x-4">
              <Link
                to="/signup"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white border-black hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                {texts.SIGN_UP}
              </Link>
              <Link
                to="/reset-password"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white border-black hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                {texts.RESET_PASSWORD}
              </Link>
            </div>
            <input
              type="hidden"
              name="redirect-to"
              value={searchParams.get("redirectTo") ?? undefined}
            />
          </Form>
        </div>
      </div>
    </main>
  );
}
