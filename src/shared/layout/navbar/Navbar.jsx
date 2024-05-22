import * as React from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import {
  Home,
  CalendarClock,
  PanelLeft,
  LogOut,
  Search,
  Settings,
  User,
  CalendarHeart
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../@/components/ui/breadcrumb"

import { Button } from "../../../../@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../@/components/ui/dropdown-menu"

import { Input } from "../../../../@/components/ui/input"

import { Sheet, SheetContent, SheetTrigger } from "../../../../@/components/ui/sheet"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "../../../../@/components/ui/tooltip"

import "../../../../app/globals.css"
import logo from "../../images/logo.png"
import { useAuth as useAuthClient } from "../../../Client/context/AuthContext"
import { useAuth as useAuthBarbershop } from "../../../Barbershop/context/BarberContext"


const Navbar = () => {
  const { pathname } = useLocation()
  const isBarberRoutes = pathname.startsWith("/barber")
  const { signOut, offAuthToken, isLogged: isLoggedBarber } = useAuthBarbershop()
  const { logout, offDataAuth, isLogged, handleShowFavorites, handleCloseShowFavorites, showBarbershopFavorites } = useAuthClient()

  const isLoggedForRoute = isBarberRoutes && isLoggedBarber || isLogged;

  React.useEffect(() => {
    document.body.classList.add('dark'); // Adiciona a classe 'dark' ao body quando a página é montada
    return () => {
      document.body.classList.remove('dark'); // Remove a classe 'dark' quando a página é desmontada
    };
  }, []);

  const handlePathGenerate = (path) => {


    const routes = {
      home: {
        barber: "/barber/homeBarber",
        user: "/"
      },
      profile: {
        barber: "/barber/profileBarber",
        user: "/profile"
      },
      register: {
        barber: "/barber/registerBarber",
        user: "/register"
      },
      authenticate: {
        barber: "/barber/authenticateBarber",
        user: "/authenticate"
      },
      calendar: {
        barber: "/barber/calendarBarber"
      },

    }

    const route = isBarberRoutes ? routes[path].barber : routes[path].user

    return route;
  }

  const handleOffPage = () => {

    if (isBarberRoutes) {
      signOut();
      offAuthToken();
    } else {
      logout();
      offDataAuth();
    }

    window.location.reload()
  };

  const selectedFavorites = () => {
    if (showBarbershopFavorites) {
      handleCloseShowFavorites();
    } else {
      handleShowFavorites();
    }
  };

  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-marrom-escuro text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <img src={logo} className="h-6 w-6  transition-all group-hover:scale-110 " />

          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={handlePathGenerate("home")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Página Inicial</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className={"bg-marrom-medio"} side="right">Página Inicial</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={handlePathGenerate("calendar")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {isBarberRoutes ?
                    <>
                      <CalendarClock className="h-5 w-5" />
                      <span className="sr-only">{"calendar"}</span>
                    </> :
                    <>
                      <CalendarHeart onClick={selectedFavorites} className="h-5 w-5" />
                      <span className="sr-only">{"Orders"}</span>
                    </>
                  }
                </Link>
              </TooltipTrigger>
              <TooltipContent className={"bg-marrom-medio"} side="right">{isBarberRoutes ? "calendar" : "Barbearia favorita"}</TooltipContent>
            </Tooltip>
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Products</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className={"bg-marrom-medio"} side="right">Products</TooltipContent>
            </Tooltip> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={handlePathGenerate("profile")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Meu Perfil</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className={"bg-marrom-medio"} side="right">Meu Perfil</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleOffPage}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sair</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className={"bg-marrom-medio"} side="right">Sair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={"#"}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configurações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent className={"bg-marrom-medio"} side="right">Configurações</TooltipContent>
          </Tooltip>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 ">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden border-0">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid pt-20 gap-6 text-lg font-medium ml-2">
                <Link
                  to={handlePathGenerate("home")}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  to={handlePathGenerate("calendar")}
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <CalendarClock className="h-5 w-5" />
                  Agenda
                </Link>
                <Link
                  to={handlePathGenerate("profile")}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <User className="h-5 w-5" />
                  Perfil
                </Link>
                <button
                  onClick={handleOffPage}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>

                {/* <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link> */}
              </nav>
            </SheetContent>
          </Sheet>

          <Breadcrumb className="hidden md:flex">

            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Além de estilo</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={handlePathGenerate("home")}>Página inicial</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={handlePathGenerate(isLoggedForRoute ? "profile" : "authenticate")}>
                    {isLoggedForRoute ? "Perfil" : "Entrar"}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="    Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <img
                  src="/placeholder-user.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-marrom-escuro" align="end">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
    </div >


  )
}

export default Navbar