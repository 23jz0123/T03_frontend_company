// products.tsx

import { 
    useGetIdentity,
    TextField, // 読み取り専用のテキスト表示用コンポーネント
    EmailField,
    Show,
    SimpleShowLayout, 
    RichTextField,
    TopToolbar,
    EditButton
} from 'react-admin';

const ProductShowActions = () => (
    <TopToolbar>
        <EditButton label="編集"/>
    </TopToolbar>
);

export const ProductShow = () => {
    const { identity, isLoading: isIdentityLoading } = useGetIdentity();
    console.log('id:', identity?.id);

    if (isIdentityLoading) {
        return <div>Loading...</div>;
    }

    if (!identity) {
        return <div>ログイン情報が見つかりません</div>;
    }
    return (
        <Show resource="products" id={identity.id} actions={<ProductShowActions />}>
            <SimpleShowLayout>
                <TextField source="company_name" label="会社名"/>
                <TextField source="address" label="住所"/>
                <RichTextField source="business_detail" label="事業内容"/>
                <TextField source="capital" label="資本金"/>
                <EmailField source="email" label="メールアドレス"/>
                <TextField source="employee_count" label="従業員数"/>
                <TextField source="foundation" label="設立年"/>
                <TextField source="industry_name" label="業種"/>
                <RichTextField source="introduction" label="会社紹介文"/>
                <TextField source="office_location" label="事業所"/>
                <TextField source="phone_number" label="電話番号"/>
                <TextField source="postal_code" label="郵便番号"/>
                <RichTextField source="profile" label="プロフィール"/>
                <TextField source="representative_name" label="採用担当者"/>
                <TextField source="sales" label="売上"/>
                <RichTextField source="service_achievement" label="主な事業実績"/>
            </SimpleShowLayout>
        </Show>
    )
};