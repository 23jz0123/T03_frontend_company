import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Show, SimpleShowLayout, TextField, NumberField, BooleanField, ArrayField, ChipField, DateField, UrlField } from "react-admin";


export const AdvertisementShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="company_name" label="会社名" />
            <TextField source="company_id" label="Company ID" />
            <NumberField source="average_age" label="平均年齢" />
            <NumberField source="average_continued_service" label="平均勤続年数" />
            <NumberField source="average_overtime" label="平均残業時間" />
            <NumberField source="average_paid_vacation" label="平均有給休暇日数" />
            <TextField source="briefing_info" label="説明会情報" />
            <UrlField source="homepage_url" label="ホームページURL" />
            <BooleanField source="international_student_recruitment" label="留学生採用" />
            <TextField source="job_recruiter_name" label="採用担当者名" />
            <NumberField source="recruiting_count" label="募集人数" />
            <NumberField source="recruitment" label="採用数" />
            <ArrayField source="tags" label="タグ">
                <SimpleShowLayout>
                    <ChipField source="" />
                </SimpleShowLayout>
            </ArrayField>
            <DateField source="created_at" label="作成日" />
            <DateField source="updated_at" label="更新日" />
            <NumberField source="year" label="年" />
            </SimpleShowLayout>
        </Show>
    );
}