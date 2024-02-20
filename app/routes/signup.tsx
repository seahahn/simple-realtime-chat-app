import {Form, useActionData} from "@remix-run/react";
import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from "@remix-run/node";
import FormInput from "~/components/FormInput";
import FormCheckbox from "~/components/FormCheckbox";
import texts from "~/constants/texts";
import PageTitle from "~/components/PageTitle";
import FormButton from "~/components/FormButton";
import {checkUserEmail, checkUserNickname, preventSignedInUser, signUp} from "~/lib/auth.server";
import {PW_REGEX_STRING, badRequest} from "~/lib/utils";
import FormWarningText from "~/components/FormWarningText";

export async function loader({request}: LoaderFunctionArgs) {
  const checkUserSession = await preventSignedInUser(request);
  return checkUserSession;
}

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const nickname = String(formData.get("nickname"));
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirm-password"));

  const errors: {email?: string; nickname?: string; password?: string} = {};

  const duplicatedEmail = await checkUserEmail(email);
  if (duplicatedEmail) {
    errors.email = `User with email ${email} already exists`;
  }

  const duplicatedNickname = await checkUserNickname(nickname);
  if (duplicatedNickname) {
    errors.nickname = `User with nickname ${nickname} already exists`;
  }

  if (password !== confirmPassword) {
    errors.password = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return badRequest({errors});
  }

  // Request to create the user account
  await signUp({email, nickname, password});

  return redirect("/signup-success");
};

export default function SignUp() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageTitle titleText={texts.SIGN_UP} />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form className="space-y-6" method="post">
            <FormInput
              labelText="Email address"
              autoComplete="email"
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              required
            />
            {actionData?.errors?.email ? (
              <FormWarningText warningText={actionData?.errors.email} />
            ) : null}
            <FormInput
              labelText="Nickname"
              autoComplete="nickname"
              id="nickname"
              name="nickname"
              placeholder="Nickname"
              required
            />
            {actionData?.errors?.nickname ? (
              <FormWarningText warningText={actionData?.errors.nickname} />
            ) : null}
            <FormInput
              labelText="Password"
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              pattern={`${PW_REGEX_STRING}`}
              required
            />
            <div>
              <FormInput
                labelText="Confirm Password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm Password"
                type="password"
                required
              />
              <mark className="block py-1 text-xs font-medium text-gray-700 bg-transparent">
                {texts.PASSWORD_GUIDE}
              </mark>
              {actionData?.errors?.password ? (
                <FormWarningText warningText={actionData?.errors.password} />
              ) : null}
            </div>
            <FormCheckbox labelText={texts.AGREE_TO_TERMS} id="terms" name="terms" required />
            <FormButton buttonText={texts.SIGN_UP} />
          </Form>
        </div>
      </div>
    </main>
  );
}
