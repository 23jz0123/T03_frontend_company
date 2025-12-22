import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Show, CreateButton, TextField, NumberField, BooleanField, ArrayField, ChipField, DateField, UrlField, List, Datagrid, TopToolbar, Create } from "react-admin";

const ListActions = () => (
    <TopToolbar>
        <CreateButton label="新規作成" />
    </TopToolbar>
);

export const AdvertisementsList = () => {
    return (
        <List actions={<ListActions />}>
            <Datagrid bulkActionButtons={false}>
                <DateField
                    source="updated_at"
                    label="最終更新日"
                    showTime 
                    locales="ja-JP" 
                    options={{ 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }}/>
                <TextField source="year" label="対象年（卒）" />
                <TextField source="pending" label="公開状態" />
            </Datagrid>
        </List>
    )
}