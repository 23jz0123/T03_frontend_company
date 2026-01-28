import type { GetManyParams, GetManyResult } from "react-admin";
import { logDP } from "../../utils";

export const getMany = async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
    const { ids } = params;
    logDP(`getMany called for ${resource}`, params);

    const selectionParamMap: { [key: string]: string } = {
      industries: "industry_ids",
      tags: "tag_ids",
      job_categories: "job_category_ids",
      prefectures: "prefecture_ids",
      welfare_benefits: "welfare_benefit_ids",
      submission_objects: "submission_object_ids",
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
          `getMany error for ${resource}, status: ${response.status}`,
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
      ? json.filter((item: { id: unknown }) => stringIds.includes(String(item.id)))
      : [];

    logDP(`getMany result for ${resource}`, data);

    return { data };
};
