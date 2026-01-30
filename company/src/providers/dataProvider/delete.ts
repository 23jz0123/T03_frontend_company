import type { DeleteParams, DeleteResult } from "react-admin";

export const deleteOne = async (resource: string, params: DeleteParams): Promise<DeleteResult> => { // Renamed to deleteOne to avoid keyword conflict
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
            `削除に失敗しました: ${response.status} ${response.statusText}`,
          );
        }
        return { data: { id: params.id } } as DeleteResult;
      } catch (error) {
        console.error("Delete Request error:", error);
        throw error;
      }
    }

    if (resource === "requirements") {
      // params.previousData で削除前データを参照する
      const { id, previousData } = params as typeof params & {
        previousData?: { advertisement_id?: string | number };
      };
      if (!id) throw new Error("ID is required for delete operation");

      const advId =
        previousData?.advertisement_id ??
        sessionStorage.getItem(`reqAdv:${id}`);
      const companyId =
        sessionStorage.getItem(`reqCompany:${id}`) ||
        (advId ? sessionStorage.getItem(`advCompany:${advId}`) : null) ||
        authId;

      if (!advId) {
        throw new Error(
          "参照情報が不足しています。求人票から募集要項を開いてください。",
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
            `削除に失敗しました: ${response.status} ${response.statusText}`,
          );
        }

        return { data: { id } } as DeleteResult;
      } catch (error) {
        console.error("Delete Request error:", error);
        throw error;
      }
    }
    throw new Error(`リソース ${resource} の削除はサポートされていません。`);
};
