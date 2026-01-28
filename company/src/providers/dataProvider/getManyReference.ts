import type { GetManyReferenceResult } from "react-admin";
import { logDP } from "../../utils";

export const getManyReference = async (resource: string, params: any): Promise<GetManyReferenceResult> => {
    if (resource === "requirements") {
      const advertisementId =
        params.id ??
        params.targetId ??
        params.filter?.advertisement_id;

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
          "company_id が不明です。広告一覧からレコードを開いてください。",
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
        data.forEach((req: { advertisement_id?: unknown; id?: unknown }) => {
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
      `リソース ${resource} の getManyReference はサポートされていません。`,
    );
};
