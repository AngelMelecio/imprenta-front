import AccessoPage from "../pages/AccessoPage";
import PerfilPage from "../pages/PerfilPage";
import { MyIcons } from "./Icons";
import CotizarPage from '../pages/Cotizar/CotizarPage'
import MaterialesPage from '../pages/Materiales/MaterialesPage'
import DetailMaterial from '../pages/Materiales/DetailMaterial'
import NewMaterial from '../pages/Materiales/NewMaterial'
import SuajesPage from '../pages/Suajes/SuajesPage'
import NewSuaje from "../pages/Suajes/NewSuaje";
import DetailSuaje from "../pages/Suajes/DetailSuaje";

export const adminRoutes = [
    {path:'/cotizar', element: <CotizarPage/>},
    {path:'/materiales', element: <NewMaterial/>},
    {path:'/suajes', element: <DetailSuaje/>},
]

export const adminTabs = [
    {to:'/cotizar', content:'Cotizar', icon: <MyIcons.Cotizar size={"20px"}/> },
    {to:'/materiales', content:'Materiales', icon: <MyIcons.Pack size={"27px"}/>},
    {to:'/suajes', content:'Suajes', icon: <MyIcons.Suaje size={"20px"}/> },
]

export const baseTabs = [
    {to:'/perfil', content:'Perfil', icon: <MyIcons.Profile size={"24px"}/>},
    {to:'/exit', content:'Cerrar Sesión', icon: <MyIcons.Exit size={"23px"}/> }
]
