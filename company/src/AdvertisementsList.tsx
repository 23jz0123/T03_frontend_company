import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Show, SimpleShowLayout, TextField, NumberField, BooleanField, ArrayField, ChipField, DateField, UrlField, List, Datagrid } from "react-admin";

export const AdvertisementsList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source="id" label="ID" />
                <TextField source="updated_at" label="更新日時" />
                <TextField source="year" label="年度" />
                <TextField source="pending" label="公開状態" />
            </Datagrid>
        </List>
    )
}