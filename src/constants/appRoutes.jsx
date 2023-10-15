import AccessoPage from "../pages/AccessoPage";
import PerfilPage from "../pages/PerfilPage";
import { MyIcons } from "./Icons";
import CotizarPage from '../pages/Cotizar/CotizarPage'
import MaterialesPage from '../pages/Materiales/MaterialesPage'
import SuajesPage from '../pages/Suajes/SuajesPage'

export const adminRoutes = [
    {path:'/cotizar', element: <CotizarPage/>},
    {path:'/materiales', element: <MaterialesPage/>},
    {path:'/suajes', element: <SuajesPage/>},
]

export const adminTabs = [
    {to:'/cotizar', content:'Cotizar', icon: <MyIcons.Cotizar size={"20px"}/> },
    {to:'/materiales', content:'Materiales', icon: <MyIcons.Leave size={"27px"}/>},
    {to:'/suajes', content:'Suajes', icon: <MyIcons.Suaje size={"20px"}/> },
]

export const baseTabs = [
    {to:'/perfil', content:'Perfil', icon: <MyIcons.Profile size={"24px"}/>},
    {to:'/exit', content:'Cerrar Sesión', icon: <MyIcons.Exit size={"23px"}/> }
]
