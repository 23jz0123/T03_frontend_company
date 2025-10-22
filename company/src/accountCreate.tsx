// AccountCreate.tsx
import { Create, SimpleForm, TextInput, useRedirect, useNotify } from "react-admin";

export const Account = () => {
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
        <TextInput source="account_name" label="アカウント名" />
        <TextInput source="password" label="パスワード" type="password" />
      </SimpleForm>
    </Create>
  );
};