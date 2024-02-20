import {Form, useActionData, useLoaderData, useSubmit} from "@remix-run/react";
import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from "@remix-run/node";
import texts from "~/constants/texts";
import FormInput from "~/components/FormInput";
import PageTitle from "~/components/PageTitle";
import FormButton from "~/components/FormButton";
import {
  checkUserNickname,
  checkUserPassword,
  deleteUser,
  getUser,
  requireUserId,
  updateUser,
} from "~/lib/auth.server";
import {UserSession} from "~/constants/types";
import {PW_REGEX_STRING, badRequest} from "~/lib/utils";
import {FormEvent} from "react";
import FormWarningText from "~/components/FormWarningText";

export async function loader({request}: LoaderFunctionArgs) {
  await requireUserId(request);
  const user = await getUser(request);
  return json({user});
}

enum SubmitEventEnum {
  SAVE = "save",
  DELETE = "delete",
}

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const _action = formData.get("_action");
  const email = String(formData.get("email"));
  const nickname = String(formData.get("nickname"));
  const password = String(formData.get("password"));
  const newPassword = String(formData.get("new-password"));

  const errors: {nickname?: string; password?: string} = {};

  const isCorrectPassword = await checkUserPassword(email, password);
  if (!isCorrectPassword) {
    errors.password = "Invalid password";
    return badRequest({errors});
  }

  if (_action === SubmitEventEnum.SAVE) {
    const duplicatedNickname = await checkUserNickname(nickname, email);
    if (duplicatedNickname) {
      errors.nickname = `User with nickname ${nickname} already exists`;
      return badRequest({errors});
    }

    // Request to update the user account
    await updateUser({email, newPassword, nickname});
  }

  if (_action === SubmitEventEnum.DELETE) {
    // Request to delete the user account
    await deleteUser(email);
  }

  return redirect("/");
};

export default function Profile() {
  const {user} = useLoaderData<{user: UserSession}>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Bring the clicked button's name and value
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const buttonName = submitter.name;
    const buttonValue = submitter.value;

    // Create a new FormData object and append the button's name and value
    // If not, the button's name and value will not be sent to the action function
    const formData = new FormData(event.currentTarget);
    formData.append(buttonName, buttonValue);

    // Show a confirmation message before submitting the form
    const _action = formData.get(buttonName);
    const confirmMsg =
      _action === SubmitEventEnum.DELETE
        ? texts.PROFILE_DELETE_CONFIRM
        : texts.PROFILE_CHANGE_CONFIRM;
    if (confirm(confirmMsg)) {
      submit(formData, {
        method: "post",
      });
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageTitle titleText={texts.USER_PROFILE} />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form className="mt-6 space-y-6" method="post" onSubmit={handleSubmit}>
            <FormInput
              defaultValue={user.email}
              labelText="Email"
              id="email"
              name="email"
              type="email"
              readOnly
            />
            <FormInput
              defaultValue={user.nickname}
              labelText="Nickname"
              autoComplete="nickname"
              id="nickname"
              name="nickname"
              placeholder="Enter your new nickname"
              required
            />
            {actionData?.errors?.nickname ? (
              <FormWarningText warningText={actionData?.errors.nickname} />
            ) : null}
            <FormInput
              labelText="Current Password"
              id="password"
              name="password"
              placeholder="Enter your current password"
              type="password"
              required
            />
            {actionData?.errors?.password ? (
              <FormWarningText warningText={actionData?.errors.password} />
            ) : null}
            <FormInput
              labelText="New Password"
              id="new-password"
              name="new-password"
              placeholder="Enter your new password"
              type="password"
              pattern={PW_REGEX_STRING}
            />
            <FormButton
              name="_action"
              value={SubmitEventEnum.SAVE}
              buttonText={texts.SAVE_CHANGES}
            />
            <FormButton
              name="_action"
              value={SubmitEventEnum.DELETE}
              buttonText={texts.DELETE_USER}
              className="w-1/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            />
          </Form>
        </div>
      </div>
    </main>
  );
}
