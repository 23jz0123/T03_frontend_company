import { 
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    required, 
    ReferenceArrayInput,
    AutocompleteArrayInput
} from "react-admin";

const validateRequired = required('必須項目です');

export const ProductEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="company_name" label="会社名" validate={validateRequired}/>
                <TextInput source="address" label="住所" validate={validateRequired}/>
                <TextInput source="business_detail" label="事業内容" validate={validateRequired}/>
                <NumberInput source="capital" label="資本金" validate={validateRequired}/>
                <TextInput source="email" label="メールアドレス" validate={validateRequired}/>
                <NumberInput source="employee_count" label="従業員数" validate={validateRequired}/>
                <NumberInput source="foundation" label="設立年" validate={validateRequired}/>
                <ReferenceArrayInput source="industry_id" reference="industries" label="業種">
                    <AutocompleteArrayInput optionText="industry_name" label="業種"/>
                </ReferenceArrayInput>
                <TextInput source="introduction" label="会社紹介文" validate={validateRequired}/>
                <TextInput source="office_location" label="事業所" validate={validateRequired}/>
                <NumberInput source="phone_number" label="電話番号" validate={validateRequired}/>
                <NumberInput source="postal_code" label="郵便番号" validate={validateRequired}/>
                <TextInput source="profile" label="プロフィール" validate={validateRequired}/>
                <TextInput source="representative_name" label="採用担当者" validate={validateRequired}/>
                <NumberInput source="sales" label="売上" validate={validateRequired}/>
                <TextInput source="service_achievement" label="主な事業実績" validate={validateRequired}/>
            </SimpleForm>
        </Edit>
    )
}