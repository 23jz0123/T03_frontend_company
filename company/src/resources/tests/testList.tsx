import { useMediaQuery } from "@mui/material";
import { List, Datagrid, TextField, SimpleList } from "react-admin";

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm")); // ロジックはJSXの外で記述

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.account_name}
          secondaryText={(record) => record.company_name}
        />
      ) : (
        <Datagrid rowClick="show">
          <TextField source="company_name" />
        </Datagrid>
      )}
    </List>
  );
};
