import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster"
export default function Layout({children,}: {children: React.ReactNode}) {
    return (
      <>
        <header>
          <Header />
        </header>
      
        {children}
        
        <Toaster />

        <footer>
          <Footer />
        </footer>

      </>
      )
}
