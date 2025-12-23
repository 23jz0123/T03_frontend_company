// AccountCreate.tsx
import { Create, SimpleForm, TextInput, useRedirect, useNotify, useDataProvider } from "react-admin";

export const Account = () => {
  const redirect = useRedirect();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const handleSubmit = async (data: any) => {
    try {
      // データ保存処理をここに記述
      const res = await dataProvider.create('account', { data });
      const accountId = res?.data?.id ?? res?.data?.account_id;
      if (!accountId) throw new Error('IDがレスポンスにありません');

      // 次画面用に保持（リロード対策）
      sessionStorage.setItem('register_account_id', String(accountId))

      // 保存成功時の処理
      notify("アカウントが作成されました", { type: "success" });
      redirect("/register/company/create"); // companyCreate にリダイレクト
    } catch (error) {
      // エラー時の処理
      notify("アカウントの作成に失敗しました", { type: "error" });
    }
  };

  return (
    <Create resource="account" title="アカウントの新規作成">
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput source="account_name" label="ユーザー名" />
        <TextInput source="password" label="パスワード" type="password" />
      </SimpleForm>
    </Create>
  );
};