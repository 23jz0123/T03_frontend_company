import { Show, SimpleShowLayout, TextField, NumberField, BooleanField, ArrayField, FunctionField, DateField, UrlField,
        SingleFieldList, ReferenceManyField, Datagrid } from "react-admin";
import Chip from "@mui/material/Chip";


export const AdvertisementShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="id" label="ID" />
                <TextField source="company_name" label="会社名" />
                <TextField source="company_id" label="Company ID" />
                <NumberField source="average_age" label="平均年齢" />
                <NumberField source="average_continued_service" label="平均勤続年数" />
                <NumberField source="average_overtime" label="平均残業時間" />
                <NumberField source="average_paid_vacation" label="平均有給休暇日数" />
                <TextField source="briefing_info" label="説明会情報" />
                <UrlField source="homepage_url" label="ホームページURL" />
                <BooleanField source="international_student_recruitment" label="留学生採用" />
                <TextField source="job_recruiter_name" label="採用担当者名" />
                <NumberField source="recruiting_count" label="募集人数" />
                <NumberField source="recruitment" label="採用数" />
                <ArrayField source="tags" label="タグ">
                    <SingleFieldList linkType={false}>
                        <FunctionField render={(tag: any) => <Chip label={String(tag)} size="small" />} />
                    </SingleFieldList>
                </ArrayField>
                <DateField source="created_at" label="作成日" />
                <DateField source="updated_at" label="更新日" />
                <NumberField source="year" label="年" />
                <ReferenceManyField
                    label="募集要項"
                    reference="requirements"
                    target="advertisement_id"
                >
                    <Datagrid bulkActionButtons={false}>
                        <TextField source="id" label="ID" />
                        <TextField source="employment_status" label="雇用形態" />
                        <TextField source="job_categories_name" label="職種" />

                {/* <ArrayField source="location" label="勤務地">
                    <SingleFieldList>
                    <ChipField source="" />
                    </SingleFieldList>
                </ArrayField>     こいつはなぜかできねえ    */}
                        <FunctionField
                            label="勤務地"
                            render={(r: any) =>
                            Array.isArray(r?.location) && r.location.length
                                ? r.location.join("、")
                                : "未登録"
                            }
                        />

                        <ArrayField source="starting_salaries" label="初任給">
                            <Datagrid bulkActionButtons={false}>
                                <TextField source="target" label="対象" />
                                <NumberField
                                    source="monthly_salary"
                                    label="月給"
                                    options={{ style: "currency", currency: "JPY" }}
                                />
                            </Datagrid>
                        </ArrayField>

                        <DateField source="updated_at" label="更新日" />
                    </Datagrid>
                </ReferenceManyField>
                {/* <ReferenceManyField label="募集要項" reference="requirements" target="advertisement_id">
                    <RequirementColumns />
                </ReferenceManyField> */}
            </SimpleShowLayout>
        </Show>
    );
}