'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
const OrbitLoader = dynamic(() => import('@/app/loading'), { ssr: false });
import { Button } from '@/components/ui/button';
import { MenuIcon, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition, useMemo } from 'react';
import { useNavigationStore } from '@/store/loading.store';
import { navItems as navLinks } from '@/constants/navlinks';
import { authAPI } from '@/lib/api';

const CustomSidebar = () => {
  const navItems = useMemo(() => navLinks, []);
  const [isPending, startTransition] = useTransition();
  const setPending = useNavigationStore((state) => state.setPending);
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      setPending(false);
    }
  }, [isPending, setPending]);

  const handleNavigation = (link: string) => {
    setPending(isPending);
    startTransition(() => {
      router.push(link);
    });
  };

  return (
    <>
      {isPending && <OrbitLoader />}
      <div className="hidden md:block">
        <div className="fixed top-0 left-0 flex flex-col w-64 h-screen bg-gray-100 dark:bg-gray-900 gap-y-7 py-5">
          <Link href={'/'} className="flex items-center justify-center h-14">
            <svg
              className="w-8 h-8 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 3V7M17 3V7M3 10H21M5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 14L9 17H15L12 14Z" fill="currentColor" />
              <path d="M12 14L15 11H9L12 14Z" fill="currentColor" />
            </svg>
            <span className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
              Chemoventry
            </span>
          </Link>
          <NavLinks navigate={handleNavigation} />
        </div>
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            className="absolute top-4 left-4 bg-transparent hover:dark:bg-gray-800 border-none"
            asChild
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 left-4 bg-transparent hover:dark:bg-gray-800 border-none"
            >
              <MenuIcon className="text-gray-800 dark:text-gray-200 scale-150" />
            </Button>
          </SheetTrigger>
          <SheetContent className="px-0 dark:bg-gray-900" side={'left'}>
            <SheetHeader className="dark:text-gray-100">
              <SheetTitle className="h-14 px-4">
                <SheetClose asChild>
                  <Link href={'/chemoventry'} className="flex items-center">
                    <svg
                      className="w-8 h-8 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 3V7M17 3V7M3 10H21M5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M12 14L9 17H15L12 14Z" fill="currentColor" />
                      <path d="M12 14L15 11H9L12 14Z" fill="currentColor" />
                    </svg>
                    <span className="dark:text-gray-200 text-2xl font-bold">
                      Chemoventry
                    </span>
                  </Link>
                </SheetClose>
              </SheetTitle>
              <SheetDescription asChild className="h-full flex flex-col">
                <div className="flex flex-col flex-grow">
                  {navItems.map((item) => (
                    <SheetClose key={item.href} asChild>
                      <div className="w-full">
                        <Button
                          onClick={() => handleNavigation(item.href)}
                          className="flex justify-start w-full no-underline bg-transparent items-center px-5 h-14 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                          <item.icon size={24} />
                          <span className="ml-4 font-medium">{item.label}</span>
                        </Button>
                      </div>
                    </SheetClose>
                  ))}
                  <div className="mt-auto px-4 pb-5">
                    <SheetClose asChild>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          authAPI.logout();
                          router.push('/login');
                        }}
                        className="flex w-full justify-start items-center text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                      >
                        <LogOut size={20} />
                        <span className="ml-4 font-medium">Logout</span>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default CustomSidebar;

const NavLinks = ({ navigate }: { navigate: (link: string) => void }) => {
  const navItems = useMemo(() => navLinks, []);
  const router = useRouter();

  const handleLogout = () => {
    authAPI.logout();
    router.push('/login');
  };

  return (
    <>
      <div className="flex flex-col flex-grow">
        {navItems.map((item) => (
          <Button
            variant={'link'}
            key={item.href}
            onClick={() => navigate(item.href)}
            className="flex justify-start no-underline items-center px-5 h-14 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <item.icon size={24} />
            <span className="ml-4 font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
      <div className="mt-auto px-4 pb-5">
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="flex w-full justify-start items-center text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
        >
          <LogOut size={20} />
          <span className="ml-4 font-medium">Logout</span>
        </Button>
      </div>
    </>
  );
};
