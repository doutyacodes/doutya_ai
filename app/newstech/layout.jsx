import LayoutWrapper from "../_components/LayoutWrapper";
import LeftSideBar from "./_components/LeftSideBar";
import Nav from "./_components/Nav";

export const metadata = {
  title: 'NewsTech',
  description: 'NewsTech section for managing news map, narrative, and analysis',
};

export default function Layout({ children }) {
  return (
    <div lang="en">
      {/* Content */}
      <div className="relative min-h-screen flex ">
        <LeftSideBar />
        <LayoutWrapper>
          <Nav />
          <div className="flex-grow relative z-10 p-3">
            {children}
          </div>
        </LayoutWrapper>
      </div>
    </div>
  );
}
