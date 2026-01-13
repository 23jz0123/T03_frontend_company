import "./App.css";
import "./login.css";
import {
  Admin,
  Resource,
  type DataProvider,
  Login,
  useGetIdentity,
  useLogin,
  useNotify,
} from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import japaneseMessages from "ra-language-japanese";
import { Link, useNavigate } from "react-router-dom";
import { ProductShow } from "./products";
import { useState } from "react";
import { AdvertisementShow } from "./advertisements";
import { AdvertisementsList } from "./AdvertisementsList";
import { RequirementShow } from "./requirement";
import { AdvertisementCreate } from "./AdvertisementCreate";
import { RequirementCreate } from "./RequirementCreate";
import { AdvertisementEdit } from "./AdvertisementEdit";
import { ProductEdit } from "./productEdit";
import { RequirementEdit } from "./RequirementEdit";

const logDP = (...args: any[]) => console.debug("[DP]", ...args);

const messages = {
  ...japaneseMessages,
  ra: {
    ...(japaneseMessages as any).ra,
    action: {
      ...((japaneseMessages as any).ra.action || {}),
      confirm: "確認",
    },
    configurable: {
      ...((japaneseMessages as any).ra?.configurable || {}),
      customize: "カスタマイズ",
    },
    // 追加: sort の不足キーを補完
    sort: {
      ...((japaneseMessages as any).ra?.sort || {}),
      ASC: "昇順",
      DESC: "降順",
    },
  },
};
const customI18nProvider = polyglotI18nProvider(() => messages, "ja");

const toNumber = (val: any): number => {
  if (val === null || val === undefined || val === "") return 0;
  const number = Number(val);
  return isNaN(number) ? 0 : number;
};

const toStringSafe = (val: any): string => {
  if (val === null || val === undefined) return "";
  return String(val);
};

const normalizeNumberString = (val: string): string => {
  // e.g. "10,000" or full-width digits "１００００"
  return val
    .replace(/,/g, "")
    .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .trim();
};

const toOptionalNumber = (val: any): number | null => {
  if (val === null || val === undefined || val === "") return null;
  const raw = typeof val === "string" ? normalizeNumberString(val) : val;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const customAuthProvider = {
  async login({ username, password }) {
    const request = new Request("api/auth/company/login", {
      method: "POST",
      body: JSON.stringify({ account_name: username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    let response;
    try {
      response = await fetch(request);
    } catch (error) {
      throw new Error("Network error");
    }
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
    const auth = await response.json();
    sessionStorage.setItem("auth_id", auth.id);
  },
  async checkError(error: { status: any }) {
    const status = error.status;
    if (status === 401 || status === 403) {
      sessionStorage.removeItem("auth_id");
      throw new Error("checkError Unauthorized");
    }
  },
  async checkAuth() {
    const publicPaths = ["/register", "/accounts"]; // 認証をスキップするパス
    const currentPath = window.location.pathname;

    console.log("Current Path:", currentPath);
    console.log("Auth ID:", sessionStorage.getItem("auth_id"));

    if (publicPaths.some((path) => currentPath.startsWith(path))) {
      console.log("Skipping auth check for:", currentPath);
      return Promise.resolve(); // 認証チェックをスキップ
    }

    if (!sessionStorage.getItem("auth_id")) {
      console.log("Auth check failed");
      throw new Error("checkAuth Unauthorized");
    }
  },
  async logout() {
    sessionStorage.removeItem("auth_id");
    sessionStorage.removeItem("latestAdvertisementId");
  },
  async getIdentity() {
    const id = sessionStorage.getItem("auth_id");
    if (!id) {
      throw new Error("getIdentity Unauthorized");
    }
    return { id: id, fullName: `User ${id}`, avatar: null };
  },
};

// カスタムログインページ
// const CustomLoginPage = () => (
//   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
//     <Login />
//     <Link to="/register" style={{ marginTop: '20px', textDecoration: 'none', color: 'blue' }}>
//       新規作成はこちら
//     </Link>
//   </div>
// );
const CustomLoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Attempting login with", { username, password });
      await login({ username, password });
      const id = sessionStorage.getItem("auth_id");
      if (id) {
        navigate(`/products/${id}/show`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      notify("ログインに失敗しました", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <img src="/path/to/logo.png" alt="Logo" className="login-logo" />

          <h1 className="login-title">Bloom Career</h1>
          <p className="login-subtitle">アカウントにサインインしてください。</p>

          {/* ログインエラーをフォーム内で表示したい場合 */}
          {/* errorMessage を使うならここに <div className="login-error">...</div> */}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <i className="bx bxs-user login-input-icon" />
              <input
                className="login-input"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="login-input-group">
              <i className="bx bxs-lock-alt login-input-icon" />
              <input
                className="login-input"
                placeholder="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "ログイン中…" : "ログイン"}
            </button>
          </form>

          <p className="login-register-text">
            アカウントをお持ちでない方は{" "}
            <Link to="/register" className="register-link">
              新規作成はこちら
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const customDataProvider: DataProvider = {
  getList: async (resource, params) => {
    let url = `/api/companies/1`;
    const authId = sessionStorage.getItem("auth_id");
    const companyId = authId;

    // リソース名に応じてエンドポイントを切り替える
    if (resource === "advertisements") {
      const year = params.filter?.year || new Date().getFullYear(); // 年号を取得（デフォルトは現在の年）
      url = `/api/companies/${authId}/advertisements`;
    } else if (resource === "products") {
      url = `/api/companies/${authId}`;
    } else {
      url = `/api/list/${resource}`;
    }

    console.log("Fetching list for ${resource} from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const total = response.headers.get("X-Total-Count");
    const data = await response.json();

    if (resource === "advertisements" && Array.isArray(data) && companyId) {
      data.forEach((adv: any) => {
        sessionStorage.setItem(`advCompany:${adv.id}`, String(companyId));
        logDP("Saved advCompany", { id: adv.id, companyId });
      });
    }

    return {
      data: Array.isArray(data)
        ? data.map((item) => ({ ...item, id: item.id }))
        : [{ ...data, id: data.id }],
      total: total
        ? parseInt(total, 10)
        : Array.isArray(data)
        ? data.length
        : 1,
    };
  },
  getOne: async (resource, params) => {
    logDP("getOne called with resource:", resource, "params:", params);
    let url;
    const authId = sessionStorage.getItem("auth_id");
    let currentAdvId = null;

    if (resource === "advertisements") {
      const { id } = params;
      if (!id) {
        throw new Error("ID is required for getOne operation");
      }
      url = `/api/companies/${authId}/advertisements/${id}`;
    } else if (resource === "requirements") {
      const { id } = params as any;
      if (!id) throw new Error("id is required");

      const advId = sessionStorage.getItem(`reqAdv:${id}`);
      currentAdvId = advId;
      let companyId =
        sessionStorage.getItem(`reqCompany:${id}`) ||
        (advId ? sessionStorage.getItem(`advCompany:${advId}`) : null);
      if (!companyId) {
        companyId = authId;
      }

      logDP("getOne requirements", { id, advId, companyId });

      if (!advId || !companyId) {
        throw new Error(
          "参照情報が不足しています。求人票から募集要項を開いてください。"
        );
      }

      url = `/api/companies/${companyId}/advertisements/${advId}/requirements/${id}`;
    } else if (resource === "products") {
      url = `/api/companies/${authId}`;
    } else {
      url = `/api/${resource}/${params.id}`;
    }

    const response = await fetch(url, {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    if (resource === "advertisements") {
      if (Array.isArray(data.tags) && data.tags.length > 0) {
        try {
          const tagsRes = await fetch("/api/list/tags");
          if (tagsRes.ok) {
            const tagsList = await tagsRes.json();

            const ids = data.tags
              .map((tagName: string) => {
                const found = tagsList.find(
                  (tag: any) => tag.tag_name === tagName
                );
                return found ? found.id : null;
              })
              .filter((id: any) => id !== null);
            data.tag_ids = ids;
            logDP("Mapped tags to tag_ids:", ids);
          }
        } catch (e) {
          console.error("Failed to fetch tags for mapping:", e);
        }
      }
    }

    if (resource === "requirements" && currentAdvId) {
      data.advertisement_id = currentAdvId;

      try {
        const [jobCatsRes, subObjsRes, prefsRes, welfaresRes] =
          await Promise.all([
            fetch("/api/list/job_categories"),
            fetch("/api/list/submission_objects"),
            fetch("/api/list/prefectures"),
            fetch("/api/list/welfare_benefits"),
          ]);

        const jobCats = jobCatsRes.ok ? await jobCatsRes.json() : [];
        const subObjs = subObjsRes.ok ? await subObjsRes.json() : [];
        const prefs = prefsRes.ok ? await prefsRes.json() : [];
        const welfares = welfaresRes.ok ? await welfaresRes.json() : [];

        const findIdByName = (
          list: any[],
          nameVal: any,
          possibleKeys: string[]
        ) => {
          if (!nameVal || !Array.isArray(list)) return null;
          const searchStr = String(nameVal).trim();
          let found = list.find((item) => {
            return possibleKeys.some(
              (key) => item[key] && String(item[key]) === searchStr
            );
          });
          if (!found) {
            found = list.find((item) => {
              return Object.values(item).some(
                (val) => String(val) === searchStr
              );
            });
          }

          return found ? found.id : null;
        };

        // job_category (職種)
        if (!data.job_category_id) {
          const searchName =
            data.job_categories_name ||
            data.job_category_name ||
            data.job_category;
          if (searchName) {
            const mappedId = findIdByName(jobCats, searchName, [
              "name",
              "job_category_name",
              "job_categories_name",
            ]);
            if (mappedId) {
              data.job_category_id = mappedId;
            } else {
              console.warn("JobCategory Mapping Failed:", searchName);
            }
          }
        }
        // submission_objects (提出物)
        if (
          !data.submission_objects_id ||
          data.submission_objects_id.length === 0
        ) {
          const subNames =
            data.submission_objects || data.submission_object_names;
          if (Array.isArray(subNames)) {
            data.submission_objects_id = subNames
              .map((name: any) =>
                findIdByName(subObjs, name, ["name", "submission_object_name"])
              )
              .filter((id: any) => id !== null);
          } else {
            data.submission_objects_id = [];
          }
        }

        // prefecture (都道府県)
        if (!data.prefecture_id || data.prefecture_id.length === 0) {
          const prefNames = data.prefectures || data.prefecture_names;
          if (Array.isArray(prefNames)) {
            data.prefecture_id = prefNames
              .map((name: any) =>
                findIdByName(prefs, name, ["name", "prefecture_name"])
              )
              .filter((id: any) => id !== null);
          } else {
            data.prefecture_id = [];
          }
        }

        // welfare_benefits (福利厚生)
        if (
          !data.welfare_benefits_id ||
          data.welfare_benefits_id.length === 0
        ) {
          const welNames = data.welfare_benefits || data.welfare_benefit_names;
          if (Array.isArray(welNames)) {
            data.welfare_benefits_id = welNames
              .map((name: any) =>
                findIdByName(welfares, name, ["name", "welfare_benefit_name"])
              )
              .filter((id: any) => id !== null);
          } else {
            data.welfare_benefits_id = [];
          }
        }

        logDP("Mapped requirement IDs:", {
          job: data.job_category_id,
          sub: data.submission_objects_id,
          pref: data.prefecture_id,
          wel: data.welfare_benefits_id,
        });
      } catch (e) {
        console.error("Failed to fetch lists for requirements mapping:", e);
      }
    }

    if (resource === "products") {
      if (!data.id) data.id = authId;

      if (
        Array.isArray(data.industry_names) &&
        data.industry_names.length > 0
      ) {
        try {
          const industriesRes = await fetch("/api/list/industries");
          if (industriesRes.ok) {
            const industriesList = await industriesRes.json();

            const ids = data.industry_names
              .map((name: string) => {
                const found = industriesList.find(
                  (ind: any) => ind.industry_name === name
                );
                return found ? found.id : null;
              })
              .filter((id: any) => id !== null);

            data.industry_id = ids; // Edit画面用のフィールドにセット
            logDP("Mapped industry_names to industry_id:", ids);
          }
        } catch (e) {
          console.error("Failed to fetch industries for mapping:", e);
        }
      }
      if (!data.industry_id) {
        data.industry_id = [];
      }
    }

    return { data: { ...data, _full: true } };
  },

  getMany: async (resource, params) => {
    const { ids } = params;
    logDP(`getMany called for ${resource}`, params);

    const selectionParamMap: { [key: string]: string } = {
      industries: "industry_ids",
      tags: "tag_ids",
      job_categories: "job_category_ids",
      prefectures: "prefecture_ids",
      welfare_benefits: "welfare_benefit_ids",
      submission_objects: "submission_objects_ids",
    };

    const paramName = selectionParamMap[resource];
    console.log(`getMany paramName for ${resource}:`, paramName);
    let url = `/api/list/${resource}`;

    if (paramName) {
      const queryString = ids.map((id) => `${paramName}=${id}`).join("&");

      url = `/api/list/${resource}/selection?${queryString}`;
      console.log(`getMany fetching ${resource} with URL:`, url);

      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(
          `getMany error for ${resource}, status: ${response.status}`
        );
      }
      const text = await response.text();
      let json;
      try {
        json = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error(`JSON Parse failed for getMany ${resource}:`, e);
        json = [];
      }

      return { data: json };
    }

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    const stringIds = ids.map(String);
    const data = Array.isArray(json)
      ? json.filter((item: any) => stringIds.includes(String(item.id)))
      : [];

    logDP(`getMany result for ${resource}`, data);

    return { data };
  },

  getManyReference: async (resource, params) => {
    if (resource === "requirements") {
      const advertisementId =
        (params as any).id ??
        (params as any).targetId ??
        (params as any).filter?.advertisement_id;

      logDP("getManyReference requirements params", params, {
        advertisementId,
      });

      if (!advertisementId)
        throw new Error("advertisement_id が指定されていません");

      const companyId = sessionStorage.getItem("auth_id");
      logDP("sessionStorage advCompany", {
        [`advCompany:${advertisementId}`]: companyId,
      });

      if (!companyId)
        throw new Error(
          "company_id が不明です。広告一覧からレコードを開いてください。"
        );

      const url = `/api/companies/${companyId}/advertisements/${advertisementId}/requirements`;
      logDP("GET", url);

      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      logDP("resp", response.status, response.statusText);

      if (!response.ok)
        throw new Error(`Failed to fetch requirements: ${response.statusText}`);
      const data = await response.json();
      logDP("data len", Array.isArray(data) ? data.length : 0);

      if (Array.isArray(data)) {
        data.forEach((req: any) => {
          req.advertisement_id = advertisementId;
          if (req?.id != null) {
            sessionStorage.setItem(`reqAdv:${req.id}`, String(advertisementId));
            sessionStorage.setItem(`reqCompany:${req.id}`, String(companyId));
          }
        });
      }

      return { data, total: Array.isArray(data) ? data.length : 0 };
    }
    throw new Error(
      `リソース ${resource} の getManyReference はサポートされていません。`
    );
  },

  create: async (resource, params) => {
    let url;
    let dataToSubmit;
    const authId = sessionStorage.getItem("auth_id");
    if (!authId) throw new Error("Unauthorized: No auth_id found");

    if (resource === "advertisements") {
      url = `/api/companies/${authId}/advertisements`;

      dataToSubmit = {
        ...params.data,
        //デフォルト値(company_id, pending, updated_at, created_at)の設定
        company_id: Number(authId),
        pending:
          params.data.pending !== undefined
            ? Boolean(params.data.pending)
            : false,
        tag_ids: Array.isArray(params.data.tag_ids)
          ? params.data.tag_ids.map(Number)
          : [],
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
    } else if (resource === "requirements") {
      const advId = params.data.advertisement_id;
      if (!advId) throw new Error("advertisement_idが見つかりません");

      url = `/api/companies/${authId}/advertisements/${advId}/requirements`;

      const processedAllowances = Array.isArray(params.data.various_allowances)
        ? params.data.various_allowances
            .map((item: any) => {
              const name = toStringSafe(item.name).trim();
              const first_allowance = toOptionalNumber(item.first_allowance);
              const second_allowance = toOptionalNumber(item.second_allowance);
              const third_allowance = toOptionalNumber(item.third_allowance);
              const fourth_allowance = toOptionalNumber(item.fourth_allowance);

              return {
                name,
                first_allowance,
                second_allowance,
                third_allowance,
                fourth_allowance,
              };
            })
            .filter((row: any) => {
              return (
                row.name !== "" ||
                row.first_allowance !== null ||
                row.second_allowance !== null ||
                row.third_allowance !== null ||
                row.fourth_allowance !== null
              );
            })
        : [];

      dataToSubmit = {
        advertisement_id: Number(advId),
        job_category_id: toNumber(params.data.job_category_id),

        // 文字列系 (undefined対策)
        recruitment_flow: toStringSafe(params.data.recruitment_flow),
        employment_status: toStringSafe(params.data.employment_status),
        required_days: toStringSafe(params.data.required_days),
        trial_period: toStringSafe(params.data.trial_period),
        working_hours: toStringSafe(params.data.working_hours),
        note: toStringSafe(params.data.note),

        // 数値系
        recruiting_count: toNumber(params.data.recruiting_count),
        starting_salary_first: toNumber(params.data.starting_salary_first),
        starting_salary_second: toNumber(params.data.starting_salary_second),
        starting_salary_third: toNumber(params.data.starting_salary_third),
        starting_salary_fourth: toNumber(params.data.starting_salary_fourth),
        salary_increase: toNumber(params.data.salary_increase),
        bonus: toNumber(params.data.bonus),
        holiday_leave: toNumber(params.data.holiday_leave),

        // Boolean(Varchar)系 "あり"/"なし"
        flex: params.data.flex,
        employee_dormitory: params.data.employee_dormitory,
        contract_housing: params.data.contract_housing,

        // 配列系
        submission_objects_id: Array.isArray(params.data.submission_objects_id)
          ? params.data.submission_objects_id.map(Number)
          : [],

        prefecture_id: Array.isArray(params.data.prefecture_id)
          ? params.data.prefecture_id.map(Number)
          : params.data.prefecture_id
          ? [toNumber(params.data.prefecture_id)]
          : [],

        welfare_benefits_id: Array.isArray(params.data.welfare_benefits_id)
          ? params.data.welfare_benefits_id.map(Number)
          : [],

        // 1行=1手当（first〜fourthを同一オブジェクトで送る）
        various_allowances: processedAllowances,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      console.log("Creating requirement with data:", dataToSubmit);
    } else {
      throw new Error(`リソース ${resource} の作成はサポートされていません。`);
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`CREATE Error (${resource}):`, errorText);
        throw new Error(
          `作成に失敗しました: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();

      if (resource === "requirements" && responseData?.id != null) {
        const advIdForReq = (dataToSubmit as any)?.advertisement_id;
        if (advIdForReq != null) {
          sessionStorage.setItem(
            `reqAdv:${responseData.id}`,
            String(advIdForReq)
          );
        }
        sessionStorage.setItem(`reqCompany:${responseData.id}`, String(authId));
      }
      return { data: { ...responseData, id: responseData.id } };
    } catch (error) {
      console.error("Create Request error:", error);
      throw error;
    }
  },

  update: async (resource, params) => {
    // updateしたときのレスポンスにidがないのでエラーが出る
    let url;
    let dataToSubmit;
    const authId = sessionStorage.getItem("auth_id");
    if (!authId) throw new Error("Unauthorized: No auth_id found");

    const { id, data } = params;
    if (!id) throw new Error("ID is required for update operation");

    if (resource === "products") {
      url = `/api/companies/${authId}`;
      dataToSubmit = {
        ...data,
        updated_at: new Date().toISOString(),
      };
    } else if (resource === "advertisements") {
      url = `/api/companies/${authId}/advertisements/${id}`;
      dataToSubmit = {
        ...data,
        tag_ids: Array.isArray(data.tag_ids)
          ? data.tag_ids.map(Number)
          : data.tag_ids || [],
        updated_at: new Date().toISOString(),
      };
      delete dataToSubmit.company_id;
      delete dataToSubmit.created_at;
    } else if (resource === "requirements") {
      const advId = data.advertisement_id;
      if (!advId) throw new Error("advertisement_idが見つかりません");

      sessionStorage.setItem(`reqAdv:${id}`, String(advId));
      sessionStorage.setItem(`reqCompany:${id}`, String(authId));
      url = `/api/companies/${authId}/advertisements/${advId}/requirements/${id}`;

      const processedAllowances = Array.isArray(data.various_allowances)
        ? data.various_allowances
            .map((item: any) => {
              const name = toStringSafe(item.name).trim();
              const first_allowance = toOptionalNumber(item.first_allowance);
              const second_allowance = toOptionalNumber(item.second_allowance);
              const third_allowance = toOptionalNumber(item.third_allowance);
              const fourth_allowance = toOptionalNumber(item.fourth_allowance);

              return {
                name,
                first_allowance,
                second_allowance,
                third_allowance,
                fourth_allowance,
              };
            })
            .filter((row: any) => {
              return (
                row.name !== "" ||
                row.first_allowance !== null ||
                row.second_allowance !== null ||
                row.third_allowance !== null ||
                row.fourth_allowance !== null
              );
            })
        : [];

      dataToSubmit = {
        ...data,
        various_allowances: processedAllowances,
        updated_at: new Date().toISOString(),
      };
    } else {
      throw new Error(`リソース ${resource} の更新はサポートされていません。`);
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`UPDATE Error (${resource}):`, errorText);
        throw new Error(
          `更新に失敗しました: ${response.status} ${response.statusText}`
        );
      }

      const responseText = await response.text();
      if (!responseText) {
        logDP(
          "Update response body for ${resource} is empty, returning params.id"
        );
        return { data: { id: params.id } };
      }

      const responseData = JSON.parse(responseText);
      return { data: { ...responseData, id: responseData.id || params.id } };
    } catch (error) {
      console.error("Update Request error:", error);
      throw error;
    }
  },

  delete: async (resource, params) => {
    const authId = sessionStorage.getItem("auth_id");
    if (!authId) throw new Error("Unauthorized: No auth_id found");

    if (resource === "advertisements") {
      const { id } = params;
      const url = `/api/companies/${authId}/advertisements/${id}`;

      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`DELETE Error (${resource}):`, errorText);
          throw new Error(
            `削除に失敗しました: ${response.status} ${response.statusText}`
          );
        }
        return { data: { id: params.id } };
      } catch (error) {
        console.error("Delete Request error:", error);
        throw error;
      }
    }

    if (resource === "requirements") {
      const { id, previousData } = params as any;
      if (!id) throw new Error("ID is required for delete operation");

      const advId =
        previousData?.advertisement_id ??
        sessionStorage.getItem(`reqAdv:${id}`);
      let companyId =
        sessionStorage.getItem(`reqCompany:${id}`) ||
        (advId ? sessionStorage.getItem(`advCompany:${advId}`) : null) ||
        authId;

      if (!advId) {
        throw new Error(
          "参照情報が不足しています。求人票から募集要項を開いてください。"
        );
      }

      const url = `/api/companies/${companyId}/advertisements/${advId}/requirements/${id}`;

      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`DELETE Error (${resource}):`, errorText);
          throw new Error(
            `削除に失敗しました: ${response.status} ${response.statusText}`
          );
        }

        return { data: { id } };
      } catch (error) {
        console.error("Delete Request error:", error);
        throw error;
      }
    }
    throw new Error(`リソース ${resource} の削除はサポートされていません。`);
  },
};

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
