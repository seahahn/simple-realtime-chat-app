import texts from "~/constants/texts";

export default function Index() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 py-10 text-center gap-4 h-dvh">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        {texts.APP_NAME}
      </h1>
      <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
        {texts.APP_DESCRIPTION}
      </p>
    </main>
  );
}
