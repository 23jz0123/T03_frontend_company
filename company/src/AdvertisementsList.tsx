import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Show, SimpleShowLayout, TextField, NumberField, BooleanField, ArrayField, ChipField, DateField, UrlField, List, Datagrid } from "react-admin";

export const AdvertisementsList = () => {
    return (
        <List>
            <Datagrid>
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
                <TextField source="year" label="年度" />
                <TextField source="pending" label="公開状態" />
            </Datagrid>
        </List>
    )
}