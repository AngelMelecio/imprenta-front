import AccessoPage from "../pages/AccessoPage";
import PerfilPage from "../pages/PerfilPage";
import { MyIcons } from "./Icons";
import CotizarPage from '../pages/Cotizar/CotizarPage'
import MaterialesPage from '../pages/Materiales/MaterialesPage'
import DetailMaterial from '../pages/Materiales/DetailMaterial'
import NewMaterial from '../pages/Materiales/NewMaterial'
import SuajesPage from '../pages/Suajes/SuajesPage'
import DetailSuaje from "../pages/Suajes/DetailSuaje";
import NewSuaje from "../pages/Suajes/NewSuaje";
import UsuariosPage from '../pages/Usuarios/UsuariosPage'
import DetailUsuario from "../pages/Usuarios/DetailUsuario";
import NewUsuario from "../pages/Usuarios/NewUsuario";

export const adminRoutes = [
    //Usuarios
    {path:'/usuarios', element: <UsuariosPage/>},
    {path:'/usuarios/0', element: <NewUsuario/>},
    {path:'/usuarios/:id', element: <DetailUsuario/>},
    //Materiales
    {path:'/materiales', element: <MaterialesPage/>},
    {path:'/materiales/0', element: <NewMaterial/>},
    {path:'/materiales/:id', element: <DetailMaterial/>},
    //Suajes
    {path:'/suajes', element: <SuajesPage/>},
    {path:'/suajes/0', element: <NewSuaje/>},
    {path:'/suajes/:id', element: <DetailSuaje/>},
    //Cotizar
    {path:'/cotizar', element: <CotizarPage/>},
]

export const adminTabs = [
    {to:'/usuarios', content:'Usuarios', icon: <MyIcons.Key size={"24px"}/>},
    {to:'/cotizar', content:'Cotizar', icon: <MyIcons.Cotizar size={"20px"}/> },
    {to:'/materiales', content:'Materiales', icon: <MyIcons.Pack size={"27px"}/>},
    {to:'/suajes', content:'Suajes', icon: <MyIcons.Suaje size={"20px"}/> },
]

export const baseTabs = [
    {to:'/perfil', content:'Perfil', icon: <MyIcons.Profile size={"24px"}/>},
    {to:'/exit', content:'Cerrar Sesión', icon: <MyIcons.Exit size={"23px"}/> }
]
