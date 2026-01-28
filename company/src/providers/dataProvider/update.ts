import type { UpdateParams, UpdateResult } from "react-admin";
import { toOptionalNumber, toStringSafe, toNumber } from "../../utils";

export const update = async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
    let url;
    let dataToSubmit: Record<string, unknown>;
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
            .map((item: Record<string, unknown>) => {
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
            .filter((row: Record<string, unknown>) => {
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
        job_category_id: toNumber(data.job_category_id),
        submission_objects_id: Array.isArray(data.submission_objects_id)
          ? data.submission_objects_id.map(Number)
          : [],

        prefecture_id: Array.isArray(data.prefecture_id)
          ? data.prefecture_id.map(Number)
          : data.prefecture_id
          ? [toNumber(data.prefecture_id)]
          : [],

        welfare_benefits_id: Array.isArray(data.welfare_benefits_id)
          ? data.welfare_benefits_id.map(Number)
          : [],
        various_allowances: processedAllowances,
        updated_at: new Date().toISOString(),
      };
    } else {
      throw new Error(`リソース ${resource} の更新はサポートされていません。`);
    }
    console.log("Updating requirement with data:", dataToSubmit);

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
          `更新に失敗しました: ${response.status} ${response.statusText}`,
        );
      }

      const responseText = await response.text();
      // レスポンスが空の場合のハンドリング
      if (!responseText) {
        console.debug(
          `Update response body for ${resource} is empty, returning params.id`
        );
        return { data: { id: params.id, ...data } };
      }

      const responseData = JSON.parse(responseText);
      return { data: { ...responseData, id: responseData.id || params.id } };
    } catch (error) {
      console.error("Update Request error:", error);
      throw error;
    }
};
