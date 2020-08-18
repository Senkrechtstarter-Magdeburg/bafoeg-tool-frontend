import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MainPageComponent} from "./feature/pages/main-page/main-page.component";
import {AboutPageComponent} from "./feature/pages/about-page/about-page.component";

const routes: Routes = [
  {
    path: "",
    component: MainPageComponent,
    pathMatch: "full"
  },
  {
    path: "about",
    component: AboutPageComponent
  },
  {
    path: "app",
    loadChildren: () => import("./feature/pages/app-page/app-page.module").then(mod => mod.AppPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
