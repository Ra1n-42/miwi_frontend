import { AiFillGithub } from "react-icons/ai";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex p-5 text-lg justify-between text-white font-semibold">
      <div className="copyright">© {currentYear}. All rights reserved</div>

      <div className="links self-center text-white">
        <a href="https://github.com/Ra1n-42" aria-label="GitHub">
          <AiFillGithub size={24} />
        </a>
      </div>
    </div>
  );
}
