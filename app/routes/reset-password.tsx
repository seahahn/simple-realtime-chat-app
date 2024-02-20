import {Form, redirect, useActionData} from "@remix-run/react";
import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import FormInput from "~/components/FormInput";
import texts from "~/constants/texts";
import PageTitle from "~/components/PageTitle";
import FormButton from "~/components/FormButton";
import {checkUserEmail, preventSignedInUser, updateUser} from "~/lib/auth.server";
import {badRequest, generateTempPassword} from "~/lib/utils";
import FormWarningText from "~/components/FormWarningText";
import sendMail from "~/lib/mail.server";

export async function loader({request}: LoaderFunctionArgs) {
  const checkUserSession = await preventSignedInUser(request);
  return checkUserSession;
}

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = String(formData.get("email"));

  const errors: {email?: string} = {};

  const emailExists = await checkUserEmail(email);
  if (!emailExists) {
    errors.email = `User with email ${email} does not exist`;
    return badRequest({errors});
  }

  // Generate temporary password
  const tempPassword = generateTempPassword();

  // Update the user's password with the temporary password
  await updateUser({email, newPassword: tempPassword, nickname: ""});

  // Send the email
  const result = await sendMail({
    subject: `${texts.APP_NAME} - ${texts.RESET_PASSWORD}`,
    to: email,
    html: `<h2>${`${texts.APP_NAME} - ${texts.RESET_PASSWORD}`}</h2>
          <p>Your temporary password is: ${tempPassword}</p>`,
  });

  if (result.rejected.length > 0) {
    errors.email = `Failed to send email to ${email}`;
    return badRequest({errors});
  }

  return redirect("/reset-password-success");
};

export default function ResetPassword() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageTitle titleText={texts.RESET_PASSWORD} />
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
            {actionData?.errors?.email ? (
              <FormWarningText warningText={actionData?.errors.email} />
            ) : null}
            <FormButton buttonText={texts.RESET_PASSWORD} />
          </Form>
        </div>
      </div>
    </main>
  );
}
