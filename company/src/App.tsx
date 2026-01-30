import "./App.css";
import "./login.css";
import { Admin, Resource } from "react-admin";
import { ProductShow } from "./resources/products/products";
import { AdvertisementShow } from "./resources/advertisements/advertisements";
import { AdvertisementsList } from "./resources/advertisements/AdvertisementsList";
import { RequirementShow } from "./resources/requirements/requirement";
import { AdvertisementCreate } from "./resources/advertisements/AdvertisementCreate";
import { RequirementCreate } from "./resources/requirements/RequirementCreate";
import { AdvertisementEdit } from "./resources/advertisements/AdvertisementEdit";
import { ProductEdit } from "./resources/products/productEdit";
import { RequirementEdit } from "./resources/requirements/RequirementEdit";
import { customDataProvider } from "./providers/dataProvider/index";
import { customAuthProvider } from "./providers/authProvider";
import { customI18nProvider } from "./providers/i18nProvider";
import { CustomLoginPage } from "./pages/LoginPage";

const App = () => (
  <Admin
    dataProvider={customDataProvider}
    authProvider={customAuthProvider}
    loginPage={CustomLoginPage}
    i18nProvider={customI18nProvider}
  >
    <Resource
      name="products"
      show={ProductShow}
      list={ProductShow}
      edit={ProductEdit}
      options={{ label: "会社情報" }}
    />
    <Resource
      name="advertisements"
      list={AdvertisementsList}
      show={AdvertisementShow}
      create={AdvertisementCreate}
      edit={AdvertisementEdit}
      options={{ label: "求人票一覧" }}
    />
    <Resource
      name="requirements"
      show={RequirementShow}
      create={RequirementCreate}
      edit={RequirementEdit}
    />
    <Resource name="tags" />
    <Resource name="industries" />
    <Resource name="job_categories" />
    <Resource name="prefectures" />
    <Resource name="welfare_benefits" />
    <Resource name="submission_objects" />
  </Admin>
);

export default App;
