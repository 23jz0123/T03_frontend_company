import { Create, SimpleForm, TextInput, NumberInput, useRedirect, useNotify, useDataProvider, ReferenceArrayInput, AutocompleteArrayInput } from "react-admin";
import { useLocation } from "react-router-dom";

export const RequirementCreate = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const advertisementId = params.get("advertisement_id");
    return (
        <Create resource="requirements" title="募集要項の作成">
            <SimpleForm defaultValues={{ advertisement_id: advertisementId}}>
            <TextInput source="employee_status" label="雇用形態" />
            <TextInput source="requirement_flow" label="採用フロー" />
            <TextInput source="required_days" label="内々定までの所要日数" />
            <NumberInput source="recruiting_count" label="募集人数" />
            <TextInput source="various_allowance" label="諸手当" />
            <TextInput source="trial_period" label="試用期間" />
            <NumberInput source="salary_increase" label="昇給" />
            <NumberInput source="bonus" label="賞与" />
            <NumberInput source="holiday_leave" label="年間休日" />
            <TextInput source="employee_dormitory" label="社員寮" />
            <TextInput source="contract_housing" label="契約住宅" />
            <TextInput source="flex" label="フレックス" />
            <TextInput source="working_hour" label="勤務時間" />
            // 福利厚生リスト
            // 初任給リスト
            <ReferenceArrayInput source="industry_id" reference="industries" label="業界">
                <AutocompleteArrayInput optionText="industry_name" />
            </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    );
}