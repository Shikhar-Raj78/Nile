import { Link } from "react-router-dom";
import ContentWrapper from "../components/ContentWrapper";

const Footer = () => {
  return (
    <footer className="px-4 pt-4 w-full flex bg-[#0e1629] text-white border-[#000000] lg:pb-40">
      <ContentWrapper>
        <aside>
          <div className="flex gap-52">
            <div>
              <p className="text-base md:text-lg font-light">
                Copyright © 2023 - Made With 🖤 by
                <a
                  className="font-bold capitalize hover:border-b-4 border-black"
                  href="https://github.com/"
                  target="_blank"
                >
                  Me
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-base md:text-xl font-semibold">Connect:</h2>
              <ul className="flex flex-col text-base md:text-lg font-medium">
                <Link to={"https://github.com/"} target="_blank">
                  <li className="border-b-4 border-transparent hover:border-black w-fit">
                    GitHub:
                  </li>
                </Link>
                <Link
                  to={"https://www.linkedin.com/in/"}
                  target="_blank"
                >
                  <li className="border-b-4 border-transparent hover:border-black w-fit">
                    LinkedIn: 
                  </li>
                </Link>
                <Link
                  to={"https://www.instagram.com/"}
                  target="_blank"
                >
                  <li className="hover:border-b-4 border-black w-fit">
                    Instagram: 
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </aside>
      </ContentWrapper>
    </footer>
  );
};
export default Footer;
