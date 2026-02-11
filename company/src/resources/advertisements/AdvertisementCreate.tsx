import { useEffect, useRef } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  CheckboxGroupInput,
  ReferenceArrayInput,
  useDataProvider,
  useNotify,
} from "react-admin";
import type { RaRecord } from "react-admin";

interface Advertisement extends RaRecord {
  year?: number | string;
  // 他のフィールドは必要に応じて追加
}
import { useFormContext } from "react-hook-form";

const validateRequired = required("必須項目です");

const PrefillFromLatestAdvertisement = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { reset, getValues } = useFormContext();
  const done = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (done.current) return;

      const latestId = sessionStorage.getItem("latestAdvertisementId");
      if (!latestId) return; // Listを経由していない場合は何もしない

      try {
        const res = await dataProvider.getOne<Advertisement>("advertisements", {
          id: latestId,
        });
        const base = res?.data;
        if (!base) return;

        // 例: 年だけは「前年コピーして +1」にしたい場合
        const nextYear =
          base?.year != null && base.year !== ""
            ? Number(base.year) + 1
            : new Date().getFullYear();

        reset({
          ...getValues(),
          ...base,
          year: nextYear,
        });

        done.current = true;
      } catch {
        notify("直近データの取得に失敗しました", { type: "warning" });
      }
    };

    run();
  }, [dataProvider, notify, reset, getValues]);

  return null;
};

export const AdvertisementCreate = () => {
  const redirect = (
    _resource: string | undefined,
    id: string | number | undefined,
  ) => {
    return `/requirements/create?advertisement_id=${id}`;
  };

  return (
    <Create
      redirect={redirect}
      resource="advertisements"
      title="求人票の新規作成"
    >
      <SimpleForm>
        <PrefillFromLatestAdvertisement />
        <NumberInput
          source="year"
          label="対象年（卒）"
          placeholder="2026"
          helperText="半角数字で入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="recruiting_count"
          label="募集人数"
          placeholder="100"
          helperText="半角数字で入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="recruitment"
          label="本校卒業生採用数"
          placeholder="10"
          helperText="半角数字で入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="age_limit"
          label="年齢制限（歳以下）"
          placeholder="25"
          helperText="半角数字で入力してください"
          validate={validateRequired}
        />
        <NumberInput
          source="average_age"
          label="平均年齢"
          placeholder="35.5"
          helperText="半角数字で入力してください"
          validate={validateRequired}
          step="any"
        />
        <NumberInput
          source="average_continued_service"
          label="平均勤続年数"
          placeholder="12.5"
          helperText="半角数字で入力してください"
          validate={validateRequired}
          step="any"
        />
        <NumberInput
          source="average_overtime"
          label="月平均所定外労働時間"
          placeholder="20.5"
          helperText="半角数字で入力してください"
          validate={validateRequired}
          step="any"
        />
        <NumberInput
          source="average_paid_vacation"
          label="平均有給休暇取得日数"
          placeholder="10.5"
          helperText="半角数字で入力してください"
          validate={validateRequired}
          step="any"
        />
        <TextInput
          source="homepage_url"
          label="ホームページURL"
          placeholder="https://example.co.jp/recruit/..."
          helperText="ホームページのURLを入力してください"
        />
        <TextInput
          source="mynavi_url"
          label="マイナビURL"
          placeholder="https://example.co.jp/recruit/..."
          helperText="マイナビのURLがあれば入力してください"
        />
        <TextInput
          source="rikunavi_url"
          label="リクナビURL"
          placeholder="https://example.co.jp/recruit/..."
          helperText="リクナビのURLがあれば入力してください"
        />
        <TextInput
          source="job_recruiter_name"
          label="採用担当者名"
          placeholder="山田 太郎"
          helperText="採用担当者の名前を入力してください"
          validate={validateRequired}
        />
        <TextInput
          source="briefing_info"
          label="説明会資料URL"
          multiline
          placeholder="https://example.co.jp/recruit/..."
          helperText="説明会資料のURLがあれば入力してください"
        />
        <ReferenceArrayInput source="tag_ids" reference="tags" label="タグ">
          <CheckboxGroupInput optionText="tag_name" helperText="複数選択可" />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
