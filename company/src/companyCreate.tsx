import { Create, SimpleForm, TextInput, NumberInput, useRedirect, useNotify, useDataProvider, ReferenceArrayInput, AutocompleteArrayInput } from "react-admin";
import { useLocation } from "react-router-dom";

export const CompanyCreate = () => {
  const redirect = useRedirect();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const location = useLocation();

  const accountIdFromState = (location.state as any)?.account_id;
  const accountId =
    accountIdFromState ??
    (sessionStorage.getItem("register_account_id")
    ? Number(sessionStorage.getItem("register_account_id"))
    : undefined);
    const handleSubmit = async (data: any) => {
      try {
        if (!accountId) {
          notify("account_idを取得できません。アカウント作成からやり直してください。", { type: "warning" });
          return;
        }
        // industry_ids を number[] に正規化
        const industry_id = Array.isArray(data?.industry_id)
          ? data.industry_id.map((v: any) => Number(v))
          : [];
  
        // body には会社情報のみ（account_id は含めない）
        const payload = { ...data, industry_id };
        delete (payload as any).account_id; // 念のため除去
  
        await dataProvider.create('company', {
          data: payload,
          meta: { company_id: accountId },
        });
  
        sessionStorage.removeItem('register_account_id');
        notify("会社情報が作成されました", { type: "success" });
        redirect("/login");
      } catch (error) {
        notify("会社情報の作成に失敗しました", { type: "error" });
      }
    };
  
  return (
    <Create resource="company">
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
      <ReferenceArrayInput source="industry_id" reference="industries" label="業界">
        <AutocompleteArrayInput optionText="industry_name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
  );
};
  
