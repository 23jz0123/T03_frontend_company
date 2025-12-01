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
    const redirect = (resource: string, id: string | number, data: any) => {
        const advId = data?.advertisement_id || advertisementId;

        if (advId) {
            return `/advertisements/${advId}/show`;
        }

        return 'list';
    }
    return (
        <Create resource="requirements" title="募集要項の作成" redirect={redirect}>
            <SimpleForm defaultValues={{ advertisement_id: advertisementId}}>
                <ReferenceInput source="job_category_id" reference="job_categories" label="職種">
                    <SelectInput optionText="job_category_name" label="職種" validate={validateRequired} helperText="一つ選択してください"/>
                </ReferenceInput>

                <SelectInput source="employment_status" label="雇用形態" choices={[
                    { id: '正社員', name: '正社員' },
                    { id: '契約社員', name: '契約社員' },
                    { id: 'パート・アルバイト', name: 'パート・アルバイト' },
                    { id: '業務委託', name: '業務委託' },
                ]} validate={validateRequired}  helperText="一つ選択してください"/>
                <ReferenceArrayInput source="prefecture_id" reference="prefectures" label="勤務地 (都道府県)">
                    <SelectArrayInput optionText="prefecture" label="勤務地 (都道府県)" validate={validateRequired} helperText="複数選択可" />
                </ReferenceArrayInput>
                <NumberInput
                    source="recruiting_count"
                    label="募集人数"
                    placeholder="100"
                    helperText="半角数字で入力してください"
                    validate={validateRequired} />
                <TextInput
                    source="recruitment_flow"
                    label="採用フロー"
                    placeholder="例：書類選考→一次面接→最終面接"
                    helperText="選考の流れを入力してください"
                    validate={validateRequired} />
                <TextInput
                    source="required_days"
                    label="内々定までの所要日数"
                    placeholder="例：約1ヶ月"
                    helperText="内々定までの所要日数を入力してください"
                    validate={validateRequired} />
                <ReferenceArrayInput source="submission_objects_id" reference="submission_objects" label="提出物">
                    <SelectArrayInput optionText="submission_object_name" label="提出物" validate={validateRequired} helperText="複数選択可" />
                </ReferenceArrayInput>
                <NumberInput source="starting_salary_first" label="初任給 (1年卒)" placeholder="220000" helperText="半角英数字で入力してください　年次による差がない場合は入力なし" />
                <NumberInput source="starting_salary_second" label="初任給 (2年卒)" validate={validateRequired} placeholder="220000" helperText="半角英数字で入力してください" />
                <NumberInput source="starting_salary_third" label="初任給 (3年卒)" placeholder="220000" helperText="半角英数字で入力してください　年次による差がない場合は入力なし" />
                <NumberInput source="starting_salary_fourth" label="初任給 (4年卒)" placeholder="220000" helperText="半角英数字で入力してください　年次による差がない場合は入力なし" />
                <TextInput
                    source="trial_period"
                    label="試用期間"
                    placeholder="例：3ヶ月"
                    helperText="試用期間の有無・期間を入力してください"
                    validate={validateRequired} />
                <NumberInput
                    source="salary_increase"
                    label="昇給/年"
                    placeholder="1"
                    helperText="昇給回数を半角数字で入力してください（なしの場合は0）"
                    validate={validateRequired} />
                <NumberInput
                    source="bonus"
                    label="賞与"
                    placeholder="2"
                    helperText="賞与回数を半角数字で入力してください（なしの場合は0）"
                    validate={validateRequired} />
                <NumberInput
                    source="holiday_leave"
                    label="年間休日"
                    placeholder="120"
                    helperText="年間休日数を半角数字で入力してください"
                    validate={validateRequired} />
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
                <TextInput
                    source="working_hours"
                    label="勤務時間"
                    placeholder="例：9:00～18:00"
                    helperText="勤務時間を入力してください"
                    validate={validateRequired} />
                <SelectInput source="flex" label="フレックス" choices={[
                    { id: 'あり', name: 'あり' },
                    { id: 'なし', name: 'なし' },
                    { id: '不明', name: '不明' },
                ]} validate={validateRequired} />
                <ArrayInput source="various_allowances" label="諸手当">
                    <SimpleFormIterator>
                        <TextInput source="name" label="手当名" />
                        <NumberInput source="first_allowance" label="金額(1年卒)" />
                        <NumberInput source="second_allowance" label="金額(2年卒)" />
                        <NumberInput source="third_allowance" label="金額(3年卒)" />
                        <NumberInput source="fourth_allowance" label="金額(4年卒)" />
                    </SimpleFormIterator>
                </ArrayInput>
                <ReferenceArrayInput source="welfare_benefits_id" reference="welfare_benefits" label="福利厚生">
                    <SelectArrayInput optionText="welfare_benefit" label="福利厚生" helperText="複数選択可"/>
                </ReferenceArrayInput>
                <TextInput source="note" label="備考" multiline helperText="ご自由に記入してください" />
            </SimpleForm>
        </Create>
    );
}