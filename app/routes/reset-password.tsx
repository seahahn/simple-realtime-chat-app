import {Button} from "~/components/ui/button";
import {Form, redirect} from "@remix-run/react";
import {ActionFunctionArgs} from "@remix-run/node";
import FormInput from "~/components/FormInput";
import texts from "~/constants/texts";
import PageTitle from "~/components/PageTitle";
import FormButton from "~/components/FormButton";

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");

  // Send the email

  return redirect("/reset-password-success");
};

export default function ResetPassword() {
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
            <FormButton name="_action" value="save" buttonText={texts.RESET_PASSWORD} />
          </Form>
        </div>
      </div>
    </main>
  );
}
