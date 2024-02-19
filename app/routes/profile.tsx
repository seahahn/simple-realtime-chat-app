import {Button} from "~/components/ui/button";
import {Form} from "@remix-run/react";
import {ActionFunctionArgs, redirect} from "@remix-run/node";
import texts from "~/constants/texts";
import FormInput from "~/components/FormInput";
import PageTitle from "~/components/PageTitle";
import FormButton from "~/components/FormButton";

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const _action = formData.get("_action");
  const email = formData.get("email");

  if (_action === "save") {
    const nickname = formData.get("nickname");
    const password = formData.get("password");

    // Request to update the user account
  }
  if (_action === "delete") {
    // Ask to confirm deletion
    // Request to delete the user account
  }

  return redirect("/");
};

export default function Profile() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageTitle titleText={texts.USER_PROFILE} />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form className="mt-6 space-y-6" method="post">
            <FormInput
              labelText="Nickname"
              autoComplete="nickname"
              id="nickname"
              name="nickname"
              placeholder="Enter your new nickname"
            />
            <FormInput
              labelText="Password"
              id="password"
              name="password"
              placeholder="Enter your new password"
              type="password"
            />
            <FormInput
              labelText="Email"
              id="email"
              name="email"
              value="example@domain.com"
              type="email"
              disabled
            />
            <FormButton name="_action" value="save" buttonText={texts.SAVE_CHANGES} />
            <FormButton
              name="_action"
              value="delete"
              buttonText={texts.DELETE_USER}
              className="w-1/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            />
          </Form>
        </div>
      </div>
    </main>
  );
}
