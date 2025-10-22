// products.tsx

import { useState, useEffect } from 'react';
import { 
    useNotify, 
    useDataProvider,
    useGetIdentity,
    Loading,
    TextField, // 読み取り専用のテキスト表示用コンポーネント
    EmailField,
    Show, SimpleShowLayout, DateField, RichTextField
} from 'react-admin';
import { Card, Typography, Container, Box, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

// export const productsList = () => {
//     const [record, setRecord] = useState<any>(null);
//     const [loading, setLoading] = useState(true);

//     const notify = useNotify();
//     const dataProvider = useDataProvider();

//     const { identity, isLoading: isIdentityLoading } = useGetIdentity();

//     useEffect(() => {
//         if (isIdentityLoading || !identity) return;

//         dataProvider.getOne('companies', { id: identity.id })
//             .then(({ data }) => {
//                 setRecord(data);
//                 setLoading(false);
//             })
//             .catch(() => {
//                 notify('情報の取得に失敗しました', { type: 'error' });
//                 setLoading(false);
//             });
//     }, [identity, isIdentityLoading, dataProvider, notify]);

//     if (loading || isIdentityLoading) {
//         return <Loading />;
//     }

//     if (!record) {
//         return (
//             <Container component="main">
//                 <Typography variant="h5">情報が見つかりません</Typography>
//             </Container>
//         )
//     }

//     return (
//         <Container component="main">
//             <Card sx={{ padding: 3, marginTop: 3 }}>
//                 <Box display="flex" alignItems="center" mb="3">
//                     <PersonIcon sx={{ mr: 2 }} />
//                     <Typography variant="h5">会社情報</Typography>
//                 </Box>
//                 <Grid container spacing={3}> 
                    
//                     {/* 会社名 (1項目目: 1行全体を使うため、表示後に改行される) */}
//                     <Grid item xs={12}> 
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     会社名
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="company_name" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 住所 (2項目目: 1行全体を使うため、表示後に改行される) */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     住所
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="address" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 事業内容 (3項目目) */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1}>
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     事業内容
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="business_detail" record={record} label="" multiline fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 資本金 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     資本金
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="capital" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* メールアドレス */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     メールアドレス
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <EmailField source="email" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 従業員数 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     従業員数
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="employee_count" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 設立年 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     設立年
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="foundation" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 業種 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     業種
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="industry_name" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 会社紹介文 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1}>
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     会社紹介文
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="introduction" record={record} label="" multiline fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 事業所 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     事業所
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="office_location" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 電話番号 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     電話番号
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="phone_number" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 郵便番号 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     郵便番号
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="postal_code" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* プロフィール */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1}>
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     プロフィール
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="profile" record={record} label="" multiline fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 採用担当者 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     採用担当者
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="representative_name" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 売上 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1} alignItems="center">
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     売上
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="sales" record={record} label="" fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
                    
//                     {/* 主な事業実績 */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={1}>
//                             <Grid item xs={12} sm={4} md={3}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                     主な事業実績
//                                 </Typography>
//                             </Grid>
//                             <Grid item xs={12} sm={8} md={9}>
//                                 <TextField source="service_achievement" record={record} label="" multiline fullWidth variant="standard" InputProps={{ readOnly: true }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             </Card>
//         </Container>
//     )
// };

export const ProductShow = () => {
    const [record, setRecord] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const notify = useNotify();
    const dataProvider = useDataProvider();

    const { identity, isLoading: isIdentityLoading } = useGetIdentity();

    useEffect(() => {
        if (isIdentityLoading || !identity) return;

        dataProvider.getOne('companies', { id: identity.id })
            .then(({ data }) => {
                setRecord(data);
                setLoading(false);
            })
            .catch(() => {
                notify('情報の取得に失敗しました', { type: 'error' });
                setLoading(false);
            });
    }, [identity, isIdentityLoading, dataProvider, notify]);

    if (loading || isIdentityLoading) {
        return <Loading />;
    }

    if (!record) {
        return (
            <Container component="main">
                <Typography variant="h5">情報が見つかりません</Typography>
            </Container>
        )
    }
    return (
        <Show>
        <SimpleShowLayout>
            <TextField source="company_name" label="会社名"/>
        </SimpleShowLayout>
    </Show>
    )
};
    