import { Admin, CustomRoutes } from "react-admin";
import { Resource, type DataProvider } from "react-admin";
import { CompanyCreate } from "./resources/companies/companyCreate";
import { Account } from "./resources/accounts/accountCreate";
import "./App.css";

import { Navigate, Route } from "react-router-dom";

const registerDataProvider: DataProvider = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getList: async (resource, _params) => {
    let url = `/api/companies/1`;
    if (resource === "industries") {
      url = `/api/list/industries`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // サーバーからのエラーメッセージを取得
      console.error("GET LIST Error Response:", errorText);

      throw new Error();
    }
    const totalHeader = response.headers.get("X-Total-Count");
    const data = await response.json();
    const total = totalHeader
      ? Number(totalHeader)
      : Array.isArray(data)
        ? data.length
        : 1;
    return { data, total };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMany: async (_resource, _params) => {
    const url = `/api/list/industries`;
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    const data = await resp.json();
    return { data };
  },
  create: async (resource, params) => {
    try {
      let url = "";
      if (resource === "account") {
        url = `/api/admin/companies/accounts`;
      } else if (resource === "company") {
        const companyId = params.meta?.company_id ?? params.data?.account_id; // フォールバック（渡っていれば利用）
        if (!companyId)
          throw new Error("company_id(account_id) が指定されていません");
        url = `/api/companies/${companyId}`;
      }
      console.log("[DP.create] resource:", resource);
      console.log("[DP.create] url:", url);
      console.log("[DP.create] body:", params.data);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(params.data),
      });

      if (!response.ok) {
        const errorText = await response.text(); // サーバーからのエラーメッセージを取得
        console.error("CREATE Error Response:", errorText);

        throw new Error();
      }

      const responseData = await response.json();
      console.log("CREATE Success Response:", responseData);
      return { data: responseData };
    } catch (error) {
      console.error("CREATE Request Failed:", error);
      throw error; // エラーを再スローして呼び出し元で処理
    }
  },
  getOne: () => Promise.reject(new Error("Not implemented")),
  getManyReference: () => Promise.reject(new Error("Not implemented")),
  update: () => Promise.reject(new Error("Not implemented")),
  updateMany: () => Promise.reject(new Error("Not implemented")),
  delete: () => Promise.reject(new Error("Not implemented")),
  deleteMany: () => Promise.reject(new Error("Not implemented")),
};
//const Dashboard = () => <Navigate to="/register/account/create" replace />;

const Register = () => (
  console.log("Register component rendered"),
  console.log("Current URL:", window.location.href),
  (
    <Admin
      basename="/register"
      dataProvider={registerDataProvider}
      // Dashboard を渡さず、カスタムルートでルートアクセスを作成ページへリダイレクト
    >
      <Resource name="account" create={Account} />
      <Resource name="company" create={CompanyCreate} />
      <Resource name="industries" />
      <CustomRoutes>
        <Route
          path="/"
          element={<Navigate to="/register/account/create" replace />}
        />
      </CustomRoutes>
    </Admin>
  )
);

export default Register;
