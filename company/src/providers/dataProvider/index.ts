import type { DataProvider } from "react-admin";
import { getList } from "./getList";
import { getOne } from "./getOne";
import { create } from "./create";
import { update } from "./update";
import { deleteOne } from "./delete";
import { getMany } from "./getMany";
import { getManyReference } from "./getManyReference";
import { updateMany, deleteMany } from "./notImplemented";

export const customDataProvider: DataProvider = {
  getList,
  getOne,
  create,
  update,
  delete: deleteOne,
  getMany,
  getManyReference,
  updateMany,
  deleteMany,
};
