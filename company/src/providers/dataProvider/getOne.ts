import type { GetOneParams, GetOneResult } from "react-admin";
import { logDP } from "../../utils";

export const getOne = async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
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
      const { id } = params as { id: string | number };
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
          "参照情報が不足しています。求人票から募集要項を開いてください。",
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
                  (tag: { id: number; tag_name: string }) =>
                    tag.tag_name === tagName,
                );
                return found ? found.id : null;
              })
              .filter((id: unknown) => id !== null);
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
          list: Record<string, unknown>[],
          nameVal: unknown,
          possibleKeys: string[],
        ) => {
          if (!nameVal || !Array.isArray(list)) return null;
          const searchStr = String(nameVal).trim();
          let found = list.find((item) => {
            return possibleKeys.some(
              (key) => item[key] && String(item[key]) === searchStr,
            );
          });
          if (!found) {
            found = list.find((item) => {
              return Object.values(item).some(
                (val) => String(val) === searchStr,
              );
            });
          }

          return found ? (found as { id: string | number }).id : null;
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
              .map((name: unknown) =>
                findIdByName(subObjs, name, ["name", "submission_object_name"]),
              )
              .filter((id: unknown) => id !== null);
          } else {
            data.submission_objects_id = [];
          }
        }

        // prefecture (都道府県)
        if (!data.prefecture_id || data.prefecture_id.length === 0) {
          const prefNames = data.prefectures || data.prefecture_names;
          if (Array.isArray(prefNames)) {
            data.prefecture_id = prefNames
              .map((name: unknown) =>
                findIdByName(prefs, name, ["name", "prefecture_name"]),
              )
              .filter((id: unknown) => id !== null);
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
              .map((name: unknown) =>
                findIdByName(welfares, name, ["name", "welfare_benefit_name"]),
              )
              .filter((id: unknown) => id !== null);
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
                  (ind: { industry_name: string; id: unknown }) =>
                    ind.industry_name === name,
                );
                return found ? found.id : null;
              })
              .filter((id: unknown) => id !== null);

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
};
