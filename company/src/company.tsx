import { Create, SimpleForm, TextInput, } from "react-admin";

export const companyCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <TextInput source="account_name" label="アカウント名" />
      <TextInput source="password" label="パスワード" type="password" />
    </SimpleForm>
  </Create>
);