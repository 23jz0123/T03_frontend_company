import type { GetListResult } from "react-admin";
import { logDP } from "../../utils";

export const getList = async (resource: string): Promise<GetListResult> => {
    let url = `/api/companies/1`;
    const authId = sessionStorage.getItem("auth_id");
    const companyId = authId;

    // リソース名に応じてエンドポイントを切り替える
    if (resource === "advertisements") {
      // param 'year' is unused in logic but might be intended for filter
      // const year = params.filter?.year || new Date().getFullYear();
      url = `/api/companies/${authId}/advertisements`;
    } else if (resource === "products") {
      url = `/api/companies/${authId}`;
    } else {
      url = `/api/list/${resource}`;
    }

    console.log(`Fetching list for ${resource} from URL:`, url);

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
      data.forEach((adv: { id: string | number }) => {
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
};
