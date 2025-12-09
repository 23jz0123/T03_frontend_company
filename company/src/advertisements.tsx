import { Show, SimpleShowLayout, TextField, NumberField, BooleanField, ArrayField, FunctionField, DateField, UrlField,
        SingleFieldList, ReferenceManyField, Datagrid, useRecordContext, useRedirect,
        TopToolbar,
        CreateButton,
        EditButton,
        DeleteButton,
        TabbedShowLayout
      } from "react-admin";
import { Chip, Button, Box, Typography } from "@mui/material";

const AdvertisementShowActions = () => (
  <TopToolbar>
    <EditButton label="編集"/>
    <DeleteButton label="削除" />
  </TopToolbar>
);

const RequirementDetailButton: React.FC<{ companyId?: string | number; advertisementId?: string | number }> = ({ companyId, advertisementId }) => {
  const row = useRecordContext<any>();
  const redirect = useRedirect();

  if (!row?.id || !companyId || !advertisementId) return null;

  const handleClick = () => {
    // 親IDをキャッシュ（getOne 用）
    sessionStorage.setItem(`reqAdv:${row.id}`, String(advertisementId));
    sessionStorage.setItem(`reqCompany:${row.id}`, String(companyId));
    sessionStorage.setItem(`advCompany:${advertisementId}`, String(companyId));
    redirect("show", "requirements", row.id);
  };

  return (
    <Button onClick={handleClick}>
      
    </Button>
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
  )
};

const EmptyRequirement = () => (
  <Box sx={{ textAlign: 'center', width: '100%'}}>
    <Typography variant="h6" color="textSecondary">
      募集要項はまだ登録されていません
    </Typography>
  </Box>
);

// 親（求人票）レコードから company_id, id を取得して列を組み立て
const RequirementColumns = () => {
const parent = useRecordContext<any>(); // 求人票レコード
const companyId = parent?.company_id;
const advertisementId = parent?.id;

return (
<Datagrid bulkActionButtons={false} empty={<EmptyRequirement />}>
<TextField source="employment_status" label="雇用形態" />
<TextField source="job_categories_name" label="職種" />

<FunctionField
  label="勤務地"
  render={(r: any) =>
    Array.isArray(r?.location) && r.location.length ? r.location.join("、") : "未登録"
  }
/>
<NumberField source="starting_salary_second" label="月給(2年卒)" options={{ style: "currency", currency: "JPY" }} />

<DateField source="updated_at" label="更新日" />

</Datagrid>
);
};

export const AdvertisementShow = () => {
    return (
        <Show actions={<AdvertisementShowActions />}>
          <TabbedShowLayout>
            <TabbedShowLayout.Tab label="求人情報">
                <TextField source="company_name" label="会社名" />
                <TextField source="company_name_furigana" label="会社名(ふりがな)" />
                <FunctionField source="year" label="対象年"  render={record => record.year + " 年"}/>
                <FunctionField source="average_age" label="平均年齢" render={record => record.average_age + " 歳"} />
                <FunctionField source="average_continued_service" label="平均勤続年数" render={record => record.average_continued_service + " 年"} />
                <FunctionField source="average_overtime" label="平均残業時間" render={record => record.average_overtime + " 時間"} />
                <FunctionField source="average_paid_vacation" label="平均有給休暇日数" render={record => record.average_paid_vacation + " 日"} />
                <TextField source="briefing_info" label="説明会情報" />
                <FunctionField
                  source="homepage_url"
                  label="ホームページURL"
                  render={record => record.homepage_url ? <UrlField source="homepage_url" label="ホームページURL" /> : "未登録"}
                />
                <FunctionField
                  source="mynavi_url"
                  label="マイナビURL"
                  render={record => record.mynavi_url ? <UrlField source="mynavi_url" label="マイナビURL" /> : "未登録"}
                />
                <FunctionField
                  source="rikunavi_url"
                  label="リクナビURL"
                  render={record => record.rikunavi_url ? <UrlField source="rikunavi_url" label="リクナビURL" /> : "未登録"}
                />
                <FunctionField
                  source="international_student_recruitment"
                  label="留学生採用"
                  render={record => record.international_student_recruitment ? "あり" : "なし"}
                />
                <TextField source="job_recruiter_name" label="採用担当者名" />
                <FunctionField source="recruiting_count" label="募集人数" render={record => record.recruiting_count + " 人"} />
                <FunctionField source="recruitment" label="卒業生採用数" render={record => record.recruitment + " 人"} />
                <ArrayField source="tags" label="タグ">
                    <SingleFieldList linkType={false}>
                        <FunctionField render={(tag: any) => <Chip label={String(tag)} size="small" />} />
                    </SingleFieldList>
                </ArrayField>
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="募集要項一覧">
                <ReferenceManyField label="募集要項" reference="requirements" target="advertisement_id">
                    <RequirementColumns />
                </ReferenceManyField>
                <RequirementListActions />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="日付情報">
                <DateField source="created_at" label="作成日" />
                <DateField source="updated_at" label="更新日" />
            </TabbedShowLayout.Tab>
            </TabbedShowLayout>
        </Show>
    );
}