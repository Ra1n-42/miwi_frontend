import { User } from "@/types/User";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import StreamerStatus from "@/components/StreamerStatus";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const navigation = [
  // { title: "Giveaway", href: "/giveaway" },
  { title: "Archive", href: "/archive" },
  { title: "Challenge", href: "/challenge" },
  { title: "Clips", href: "/clips" },
];
async function logout() {
  try {
    const response = await fetch("https://dev.miwi.tv/api/logout", {
      method: "POST",
      credentials: "include", // Sendet Cookies mit
    });

    if (response.ok) {
      window.location.href = "/login"; // Weiterleitung nach erfolgreichem Logout
    } else {
      console.error("Logout fehlgeschlagen");
    }
  } catch (error) {
    console.error("Fehler beim Logout:", error);
  }
}

export default function Header() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 620);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex justify-between my-2">
      <div className="flex items-center space-x-3">
        <StreamerStatus streamerName="miwitv" />
        <a
          className={`${"text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-pink-100 to-violet-600 text-bold"}`}
          href={"/"}
        >
          MiwiTV
        </a>
      </div>
      {isLargeScreen ? (
        <LargeScreenNavigation user={user} />
      ) : (
        <div className="pt-2.5">
          <DrawerNavigation user={user} />
        </div>
      )}
    </div>
  );
}

function DrawerNavigation({ user }: { user: User | null }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Menu className="text-white cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent className="h-[90dvh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex flex-col items-center">
            <DrawerTitle>Navigation</DrawerTitle>
            <DrawerDescription>Menu</DrawerDescription>
          </DrawerHeader>
          <div className="flex h-full w-full justify-center flex-col items-center">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex justify-center p-2.5 w-full rounded-lg text-white hover:bg-slate-100 hover:text-indigo-950"
              >
                <span className="text-black">{item.title}</span>
              </a>
            ))}
            {user ? (
              <div className="flex items-center flex-col space-y-2.5 w-full rounded-md">
                <a
                  href="/me"
                  className="flex justify-center w-full rounded-lg text-black hover:bg-slate-100 hover:text-indigo-950"
                >
                  {/* <img
                    src={user.avatar_url || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  /> */}
                  <span className="flex justify-center rounded-md p-2 hover:bg-slate-100 hover:text-indigo-950 w-full">
                    {user.display_name}
                  </span>
                </a>
                <a
                  onClick={logout}
                  className="flex p-2 justify-center w-full rounded-lg text-black hover:bg-slate-100 hover:text-indigo-950"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a
                href="/login"
                className="flex justify-center p-2.5 w-full rounded-lg text-black hover:bg-slate-100 hover:text-indigo-950"
              >
                Sign In
              </a>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <button className="p-2 bg-indigo-100 hover:bg-indigo-200">
                Cancel
              </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
function LargeScreenNavigation({ user }: { user: User | null }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigation.map((item) => (
          <NavigationMenuItem key={item.href}>
            <a
              href={item.href}
              className="p-2.5 rounded-lg text-white hover:bg-slate-100 hover:text-indigo-950"
            >
              <NavigationMenuLink>{item.title}</NavigationMenuLink>
            </a>
          </NavigationMenuItem>
        ))}
        {/* User Avatar oder Login */}
        {user ? (
          <NavigationMenuItem>
            <a href="/me">
              <img
                src={user.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                className="w-8 h-8 rounded-full ml-4"
              />
            </a>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem>
            <a
              href="/login"
              className="p-2.5 rounded-lg text-white hover:bg-slate-100 hover:text-indigo-950"
            >
              Sign In
            </a>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
