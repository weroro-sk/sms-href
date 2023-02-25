import {ResultCode} from "./public.types";


export type TContextType = Element | HTMLElement | Document;

export type TResolveType = (resultCode: (ResultCode | PromiseLike<ResultCode>)) => void;
export type TRejectType = (resultCode?: ResultCode) => void;

export type TSmsAnchor = HTMLAnchorElement;
export type TSmsAnchors = NodeListOf<TSmsAnchor>;

export type TSmsHrefValue = string;
export type TSeparator = string | null;
