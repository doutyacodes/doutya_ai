import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choose the weights you want to include
});

export const metadata = {
  title: "Xortlist | Craft Your Career with Xortlist!",
  description: "Xortlist is an innovative AI-powered career guidance platform designed to help individuals discover their ideal career paths. By analyzing users' personality traits and interests through detailed assessments, Xortlist provides tailored career suggestions across a spectrum of options. The platform features personalized roadmaps that guide users step-by-step through their career journey, ensuring they achieve their goals with constant feedback, milestone tracking, and engaging challenges. With Xortlist, you can confidently explore, plan, and embark on a fulfilling career journey.",
};

export default async function RootLayout({ children }) {

  return (
    <html>
      <body className={`${poppins.className} bg-[#1f1f1f] bg-cover bg-center bg-no-repeat min-h-screen`}>
      <Toaster/>
          {children}
      </body>
    </html>
  );
}
