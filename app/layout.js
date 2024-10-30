import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choose the weights you want to include
});

export const metadata = {
  title: "Doutya Kids | From Tiny Sparks to Big Dreams - Inspiring Little Learners for Limitless Possibilities.",
  description: "Doutya Kids is an AI-powered educational platform for children aged 2-12, offering personalized stories, interactive learning, and fun explanations on any topic. Designed to fuel curiosity and learning through play, Doutya Kids adapts to each child's unique needs, helping them explore the world in an engaging, age-appropriate way.",
};

export default async function RootLayout({ children }) {

  return (
    <html>
      <body className={`${poppins.className} min-h-screen`}>
      <Toaster/>
          {children}
      </body>
    </html>
  );
}
