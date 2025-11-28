import { Create,
        SimpleForm,
        TextInput,
        NumberInput,
        ReferenceArrayInput,
        ReferenceInput,
        AutocompleteArrayInput,
        required,
        SelectInput,
        SelectArrayInput,
        ArrayInput,
        SimpleFormIterator
    } from "react-admin";
import { useLocation } from "react-router-dom";

const validateRequired = required('必須項目です');

export const RequirementCreate = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const advertisementId = params.get("advertisement_id");
    return (
        <Create resource="requirements" title="募集要項の作成">
            <SimpleForm defaultValues={{ advertisement_id: advertisementId}}>
                <ReferenceInput source="job_category_id" reference="job_categories" label="職種">
                    <SelectInput optionText="job_category_name" label="職種" validate={validateRequired} />
                </ReferenceInput>

                <SelectInput source="employment_status" label="雇用形態" choices={[
                    { id: '正社員', name: '正社員' },
                    { id: '契約社員', name: '契約社員' },
                    { id: 'パート・アルバイト', name: 'パート・アルバイト' },
                    { id: '業務委託', name: '業務委託' },
                ]} validate={validateRequired} />
                <ReferenceArrayInput source="prefecture_id" reference="prefectures" label="勤務地 (都道府県)">
                    <SelectArrayInput optionText="prefecture" label="勤務地 (都道府県)" validate={validateRequired} />
                </ReferenceArrayInput>
                <NumberInput source="recruiting_count" label="募集人数" validate={validateRequired} />
                <TextInput source="recruitment_flow" label="採用フロー" validate={validateRequired} />
                <TextInput source="required_days" label="内々定までの所要日数" validate={validateRequired} />
                <ReferenceArrayInput source="submission_objects_id" reference="submission_objects" label="提出物">
                    <SelectArrayInput optionText="submission_object_name" label="提出物" validate={validateRequired} />
                </ReferenceArrayInput>
                <NumberInput source="starting_salary_first" label="初任給 (1年卒)" />
                <NumberInput source="starting_salary_second" label="初任給 (2年卒)" validate={validateRequired} />
                <NumberInput source="starting_salary_third" label="初任給 (3年卒)" />
                <NumberInput source="starting_salary_fourth" label="初任給 (4年卒)" />
                <TextInput source="trial_period" label="試用期間" validate={validateRequired} />
                <NumberInput source="salary_increase" label="昇給" validate={validateRequired} />
                <NumberInput source="bonus" label="賞与" validate={validateRequired} />
                <NumberInput source="holiday_leave" label="年間休日" validate={validateRequired} />
                <SelectInput source="employee_dormitory" label="社員寮" choices={[
                    { id: 'あり', name: 'あり' },
                    { id: 'なし', name: 'なし' },
                    { id: '不明', name: '不明' },
                ]} validate={validateRequired} />
                <SelectInput source="contract_housing" label="借上社宅" choices={[
                    { id: 'あり', name: 'あり' },
                    { id: 'なし', name: 'なし' },
                    { id: '不明', name: '不明' },
                ]} validate={validateRequired} />
                <TextInput source="working_hours" label="勤務時間" validate={validateRequired} />
                <SelectInput source="flex" label="フレックス" choices={[
                    { id: 'あり', name: 'あり' },
                    { id: 'なし', name: 'なし' },
                    { id: '不明', name: '不明' },
                ]} validate={validateRequired} />
                <ArrayInput source="various_allowances" label="諸手当">
                    <SimpleFormIterator>
                        <TextInput source="name" label="手当名" />
                        <NumberInput source="grade" label="対象年" />
                        <NumberInput source="allowance" label="金額" />
                    </SimpleFormIterator>
                </ArrayInput>
                <ReferenceArrayInput source="welfare_benefits_id" reference="welfare_benefits" label="福利厚生">
                    <SelectArrayInput optionText="welfare_benefit" label="福利厚生" />
                </ReferenceArrayInput>
                <TextInput source="note" label="備考" multiline />
            </SimpleForm>
        </Create>
    );
}