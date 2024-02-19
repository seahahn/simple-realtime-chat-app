import {Form, useActionData} from "@remix-run/react";
import {ActionFunctionArgs, redirect} from "@remix-run/node";
import FormInput from "~/components/FormInput";
import FormCheckbox from "~/components/FormCheckbox";
import texts from "~/constants/texts";
import PageTitle from "~/components/PageTitle";
import FormButton from "~/components/FormButton";
import {checkUserEmail, checkUserNickname, signUp} from "~/lib/auth.server";
import {badRequest} from "~/lib/utils";

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
              <em className="text-xs text-red-700 not-italic">{actionData?.errors.email}</em>
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
              <em className="text-xs text-red-700 not-italic">{actionData?.errors.nickname}</em>
            ) : null}
            <FormInput
              labelText="Password"
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
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
                <em className="text-xs text-red-700 not-italic">{actionData?.errors.password}</em>
              ) : null}
            </div>
            <FormCheckbox
              labelText="I agree to the Terms and Conditions"
              id="terms"
              name="terms"
              required
            />
            <FormButton buttonText={texts.SIGN_UP} />
          </Form>
        </div>
      </div>
    </main>
  );
}
