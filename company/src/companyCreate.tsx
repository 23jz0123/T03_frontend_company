import { Create, SimpleForm, TextInput, NumberInput, ReferenceInput, AutocompleteArrayInput, useRedirect, useNotify } from "react-admin";

export const companyCreate = () => {
  const redirect = useRedirect();
  const notify = useNotify();
  
  const handleSubmit = async (data: any) => {
    try {
      // データ保存処理をここに記述
      console.log("Saving data:", data);
  
      // 保存成功時の処理
      notify("アカウントが作成されました", { type: "success" });
      redirect("/register/company/create"); // companyCreate にリダイレクト
    } catch (error) {
      // エラー時の処理
      notify("アカウントの作成に失敗しました", { type: "error" });
    }
  };
  
  return (
    <Create>
      <SimpleForm onSubmit={handleSubmit}>
      <TextInput source="company_name" label="会社名" />
      <NumberInput source="capital" label="資本金" />
      <NumberInput source="sales" label="売上高" />
      <NumberInput source="employee_count" label="従業員数" />
      <TextInput source="representative_name" label="代表者名" />
      <TextInput source="profile" label="プロフィール" multiline />
      <TextInput source="introduction" label="会社紹介" multiline />
      <TextInput source="business_detail" label="事業内容" multiline />
      <NumberInput source="postal_code" label="郵便番号" />
      <TextInput source="address" label="住所" />
      <TextInput source="phone_number" label="電話番号" />
      <TextInput source="email" label="メールアドレス" />
      <NumberInput source="foundation" label="設立年" />
      <TextInput source="service_achievement" label="サービス実績" multiline />
      <TextInput source="office_location" label="オフィス所在地" />
      <ReferenceInput source="industries" reference="industries" label="業界">
        <AutocompleteArrayInput optionText="industry_name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
  );
};
  
