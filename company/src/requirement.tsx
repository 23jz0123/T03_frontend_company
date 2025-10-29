import { Show, SimpleShowLayout, TextField, NumberField, BooleanField, ArrayField, FunctionField, DateField, UrlField, SingleFieldList } from "react-admin";
import Chip from "@mui/material/Chip";


export const RequirementShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="id" label="ID" />
                <NumberField source="bonus" label="ボーナス" />
                <TextField source="contract_housing" label="契約住宅" />
                <TextField source="employee_dormitory" label="社員寮" />            
                <TextField source="employment_status" label="雇用形態" />
                <TextField source="flex" label="フレックス" />
                <NumberField source="holiday_leave" label="年間休日" />
                <TextField source="job_categories_name" label="職種" />
                <TextField source="prefectures" label="勤務地" />
                <NumberField source="recruiting_count" label="採用人数" />
                <TextField source="recruitment_flow" label="採用フロー" />
                <TextField source="required_days" label="内々定までの所要日数" />
                <NumberField source="salary_increase" label="昇給" />
                <TextField source="trial_period" label="試用期間" />
                <TextField source="working_hours" label="勤務時間" />
                <ArrayField source="submission_objects" label="必要書類">
                    <SingleFieldList linkType={false}>
                        <FunctionField render={(tag: any) => <Chip label={String(tag)} size="small" />} />
                    </SingleFieldList>
                </ArrayField>
                <TextField source="various_allowance" label="諸手当" />
                <ArrayField source="welfare_benefits" label="福利厚生">
                    <SingleFieldList linkType={false}>
                        <FunctionField render={(tag: any) => <Chip label={String(tag)} size="small" />} />
                    </SingleFieldList>
                </ArrayField>
                <DateField source="created_at" label="作成日" />
                <DateField source="updated_at" label="更新日" />
            </SimpleShowLayout>
        </Show>
    );
}