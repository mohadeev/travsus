import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from '@/app/GlobalRedux/store'
import {
  setOverlay,
  removeOverlay,
} from "@/app/GlobalRedux/Features/repeatedOverlaySlice/repeatedOverlaySlice";

export const useRepeatedOverlay = (key: string) => {
  const dispatch = useDispatch();
  const overlayState = useSelector(
    (state: RootState) => state.repeatedOverlay[key],
  );

  const toggleOverlay = useCallback(
    (params: { type?: string | null; data?: any; isVisible?: boolean }) => {
      dispatch(setOverlay({ key, ...params }));
    },
    [dispatch, key],
  );

  const closeOverlay = useCallback(() => {
    dispatch(removeOverlay(key));
  }, [dispatch, key]);

  return {
    overlayState,
    toggleOverlay,
    closeOverlay,
  };
};
