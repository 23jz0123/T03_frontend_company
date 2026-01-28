import {
  Show,
  TextField,
  NumberField,
  ArrayField,
  FunctionField,
  DateField,
  UrlField,
  SingleFieldList,
  ReferenceManyField,
  Datagrid,
  useRecordContext,
  useRedirect,
  TopToolbar,
  CreateButton,
  EditButton,
  DeleteButton,
  TabbedShowLayout,
  Button,
  useNotify,
} from "react-admin";
import { Chip, Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import type { RaRecord, Identifier } from "react-admin";

interface Advertisement extends RaRecord {
  company_id: Identifier;
  year: number;
  age_limit: number;
  average_age: number;
  average_continued_service: number;
  average_overtime: number;
  average_paid_vacation: number;
  recruiting_count: number;
  recruitment: number;
  homepage_url?: string;
  mynavi_url?: string;
  rikunavi_url?: string;
  briefing_info?: string;
  company_name: string;
  company_name_furigana: string;
  tags?: string[];
}

const AdvertisementShowActions = () => {
  const redirect = useRedirect();
  const notify = useNotify();
  return (
    <TopToolbar sx={{ justifyContent: "space-between" }}>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          label="一覧へ戻る"
          onClick={() => redirect("list", "advertisements")}
        />
      </Box>
      <Box>
        <EditButton label="求人票編集" />
        <DeleteButton
          label="求人票削除"
          mutationMode="pessimistic"
          confirmTitle="求人票を削除しますか？"
          confirmContent="この操作は取り消せません。"
          mutationOptions={{
            onSuccess: () => {
              notify("求人票を削除しました", { type: "info" });
              redirect("list", "advertisements");
            },
          }}
        />
      </Box>
    </TopToolbar>
  );
};

const RequirementListActions = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <TopToolbar>
      <CreateButton
        resource="requirements"
        label="募集要項を新規作成"
        state={{ record: { advertisement_id: record.id } }}
      />
    </TopToolbar>
  );
};

const EmptyRequirement = () => (
  <Box sx={{ textAlign: "center", width: "100%" }}>
    <Typography variant="h6" color="textSecondary">
      募集要項はまだ登録されていません
    </Typography>
  </Box>
);

// 親（求人票）レコードから company_id, id を取得して列を組み立て
const RequirementColumns = () => {
  return (
    <Datagrid bulkActionButtons={false} empty={<EmptyRequirement />}>
      <TextField source="employment_status" label="雇用形態" />
      <TextField source="job_categories_name" label="職種" />

      <FunctionField
        label="勤務地"
        render={(r) =>
          Array.isArray(r?.location) && r.location.length
            ? r.location.join("、")
            : "未登録"
        }
      />
      <NumberField
        source="starting_salary_second"
        label="月給(2年卒)"
        options={{ style: "currency", currency: "JPY" }}
      />

      <DateField
        source="updated_at"
        label="最終更新日"
        showTime
        locales="ja-JP"
        options={{
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }}
      />
    </Datagrid>
  );
};

export const AdvertisementShow = () => {
  return (
    <Show actions={<AdvertisementShowActions />} title="求人票詳細">
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="求人情報">
          <TextField source="company_name" label="会社名" />
          <TextField source="company_name_furigana" label="会社名(ふりがな)" />
          <FunctionField
            source="year"
            label="対象年（卒）"
            render={(record: Advertisement) => record.year + " 年"}
          />
          <FunctionField
            source="age_limit"
            label="年齢制限"
            render={(record: Advertisement) => record.age_limit + " 歳以下"}
          />
          <FunctionField
            source="average_age"
            label="平均年齢"
            render={(record: Advertisement) => record.average_age + " 歳"}
          />
          <FunctionField
            source="average_continued_service"
            label="平均勤続年数"
            render={(record: Advertisement) =>
              record.average_continued_service + " 年"
            }
          />
          <FunctionField
            source="average_overtime"
            label="平均残業時間"
            render={(record: Advertisement) =>
              record.average_overtime + " 時間"
            }
          />
          <FunctionField
            source="average_paid_vacation"
            label="平均有給休暇日数"
            render={(record: Advertisement) =>
              record.average_paid_vacation + " 日"
            }
          />
          <TextField source="briefing_info" label="説明会情報" />
          <FunctionField
            source="homepage_url"
            label="ホームページURL"
            render={(record: Advertisement) =>
              record.homepage_url ? (
                <UrlField
                  source="homepage_url"
                  label="ホームページURL"
                  target="_blank"
                />
              ) : (
                "未登録"
              )
            }
          />
          <FunctionField
            source="mynavi_url"
            label="マイナビURL"
            render={(record: Advertisement) =>
              record.mynavi_url ? (
                <UrlField
                  source="mynavi_url"
                  label="マイナビURL"
                  target="_blank"
                />
              ) : (
                "未登録"
              )
            }
          />
          <FunctionField
            source="rikunavi_url"
            label="リクナビURL"
            render={(record: Advertisement) =>
              record.rikunavi_url ? (
                <UrlField
                  source="rikunavi_url"
                  label="リクナビURL"
                  target="_blank"
                />
              ) : (
                "未登録"
              )
            }
          />
          <TextField source="job_recruiter_name" label="採用担当者名" />
          <FunctionField
            source="recruiting_count"
            label="募集人数"
            render={(record: Advertisement) => record.recruiting_count + " 人"}
          />
          <FunctionField
            source="recruitment"
            label="卒業生採用数"
            render={(record: Advertisement) => record.recruitment + " 人"}
          />
          <ArrayField source="tags" label="タグ">
            <SingleFieldList linkType={false}>
              <FunctionField
                render={(tag) => <Chip label={String(tag)} size="small" />}
              />
            </SingleFieldList>
          </ArrayField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="募集要項一覧">
          <ReferenceManyField
            label="募集要項"
            reference="requirements"
            target="advertisement_id"
          >
            <RequirementColumns />
          </ReferenceManyField>
          <RequirementListActions />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="日付情報">
          <DateField
            source="created_at"
            label="作成日"
            showTime
            locales="ja-JP"
            options={{
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }}
          />
          <DateField
            source="updated_at"
            label="最終更新日"
            showTime
            locales="ja-JP"
            options={{
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }}
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
