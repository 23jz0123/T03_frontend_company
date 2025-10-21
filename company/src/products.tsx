// products.tsx

import { useState, useEffect } from 'react';
import { 
    useNotify, 
    useDataProvider,
    useGetIdentity,
    Loading,
    TextField, // 読み取り専用のテキスト表示用コンポーネント
    EmailField 
} from 'react-admin';
import { Card, Typography, Container, Box, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export const productsList = () => {
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
        <Container component="main">
            <Typography variant="h2">やまじい</Typography>
        </Container>
    )
}