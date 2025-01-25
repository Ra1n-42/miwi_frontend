import { AiFillGithub } from "react-icons/ai";

export default function Footer() {
    return (
        <div className=" flex p-5 text-lg justify-between text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 via-pink-100 to-violet-600 text-bold">
          <div className="copyright">© 2024. All rights reserved</div>
    
          <div className="links self-center text-white">
            <a href="https://github.com/Ra1n-42">
              <AiFillGithub />
            </a>
          </div>
        </div>
      )
}
