import {TypedUseSelectorHook, useSelector } from "react-redux";
import { TAppState } from "../store";

export const useAppSelector: TypedUseSelectorHook<TAppState> = useSelector;
