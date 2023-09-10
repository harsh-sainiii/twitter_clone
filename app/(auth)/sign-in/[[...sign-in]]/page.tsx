import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-center pt-10">
      <SignIn appearance={{ baseTheme: dark }} />
    </div>
  );
}
