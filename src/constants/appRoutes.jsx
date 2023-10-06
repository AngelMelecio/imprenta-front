import AccessoPage from "../pages/AccessoPage";
import PerfilPage from "../pages/PerfilPage";
import { MyIcons } from "./Icons";

export const adminRoutes = [
    {path:'/perfil', element: <PerfilPage/>},
    {path:'/acceso', element: <AccessoPage/>},
]

export const adminTabs = [
    {to:'/acceso', content:'Acceso', icon: <MyIcons.FingerPrint size={"23px"}/> },
    {to:'/clientes', content:'Clientes', icon: <MyIcons.People size={"20px"}/>},
    {to:'/paquetes', content:'Paquetes', icon: <MyIcons.Pack size={"24px"}/> },
]

export const baseTabs = [
    {to:'/perfil', content:'Perfil', icon: <MyIcons.Profile size={"24px"}/>},
    {to:'/exit', content:'Cerrar Sesión', icon: <MyIcons.Exit size={"23px"}/> }
]
