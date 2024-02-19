import {Button} from "~/components/ui/button";
import {Form, useActionData} from "@remix-run/react";
import {ActionFunctionArgs, json, redirect} from "@remix-run/node";
import FormInput from "~/components/FormInput";
import FormCheckbox from "~/components/FormCheckbox";
import texts from "~/constants/texts";
import PageTitle from "~/components/PageTitle";
import FormButton from "~/components/FormButton";

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const errors: {password?: string} = {};

  // Check if the passwords are matched
  if (password !== confirmPassword) {
    errors.password = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return json({errors});
  }

  // Request to create the user account

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
              <mark className="block p-2 text-xs font-medium text-gray-700 bg-transparent">
                {texts.PASSWORD_GUIDE}
              </mark>
            </div>
            <FormCheckbox
              labelText="I agree to the Terms and Conditions"
              id="terms"
              name="terms"
              required
            />
            <FormButton buttonText={texts.SIGN_UP} />
            {actionData?.errors?.password ? (
              <em className="text-red-700 not-italic">{actionData?.errors.password}</em>
            ) : null}
          </Form>
        </div>
      </div>
    </main>
  );
}
