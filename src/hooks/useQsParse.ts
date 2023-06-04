import { ParsedQs } from "qs";
import { useLocation } from "react-router";
import { qsParse } from "../helpers/utils";

export default function useQsParse<T extends ParsedQs>() {
  const location = useLocation();
  return qsParse<T>(location.search);
}
