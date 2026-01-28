import type { CreateParams, CreateResult } from "react-admin";
import { toOptionalNumber, toStringSafe, toNumber } from "../../utils";

export const create = async (resource: string, params: CreateParams): Promise<CreateResult> => {
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
          `作成に失敗しました: ${response.status} ${response.statusText}`,
        );
      }

      const responseData = await response.json();

      if (resource === "requirements" && responseData?.id != null) {
        const advIdForReq = (dataToSubmit as Record<string, unknown>)
          ?.advertisement_id;
        if (advIdForReq != null) {
          sessionStorage.setItem(
            `reqAdv:${responseData.id}`,
            String(advIdForReq),
          );
        }
        sessionStorage.setItem(`reqCompany:${responseData.id}`, String(authId));
      }
      return { data: { ...responseData, id: responseData.id } };
    } catch (error) {
      console.error("Create Request error:", error);
      throw error;
    }
};
