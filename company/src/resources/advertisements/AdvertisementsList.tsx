import { useEffect } from "react";
import {
  CreateButton,
  TextField,
  DateField,
  List,
  Datagrid,
  TopToolbar,
  useListContext,
} from "react-admin";
import { Box, Typography } from "@mui/material";

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="新規作成" />
  </TopToolbar>
);

// Listの先頭（= sortで最新）を sessionStorage に保存
const RememberLatestAdvertisementId = () => {
  const { data, isLoading } = useListContext();

  useEffect(() => {
    if (isLoading) return;
    if (!Array.isArray(data) || data.length === 0) return;

    sessionStorage.setItem("latestAdvertisementId", String(data[0].id));
  }, [data, isLoading]);

  return null;
};

const AdvertisementsEmpty = () => (
  <Box textAlign="center" m={1}>
    <Typography variant="h4" paragraph>
      求人広告がありません
    </Typography>
    <Typography variant="body1">新しい求人広告を作成してください。</Typography>
    <Box mt={2}>
      <CreateButton label="求人広告を作成" />
    </Box>
  </Box>
);

export const AdvertisementsList = () => {
  return (
    <List
      actions={<ListActions />}
      sort={{ field: "year", order: "DESC" }}
      perPage={25}
      empty={<AdvertisementsEmpty />}
    >
      <RememberLatestAdvertisementId />
      <Datagrid bulkActionButtons={false}>
        <DateField
          source="updated_at"
          label="最終更新日"
          showTime
          locales="ja-JP"
          options={{
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }}
        />
        <TextField source="year" label="対象年（卒）" />
        <TextField source="pending" label="公開状態" />
      </Datagrid>
    </List>
  );
};
