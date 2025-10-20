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

        dataProvider.getOne('accounts', { id: identity.id })
            .then(({ data }) => {
                setRecord(data);
                setLoading(false);
            })
            .catch(() => {
                notify('情報の取得に失敗しました', { type: 'error' });
                setLoading(false);
            });
    }, [identity, isIdentityLoading, dataProvider, notify]);

    if (!record) {
        return (
            <Conatiner component="main">

            </Conatiner>
        )
    }
}