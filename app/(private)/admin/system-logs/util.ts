type ApiResponseLog = {
  id: string;
  type: string;
  meta: {
    type: string;
    message: string;
    category: string;
    severity: string;
    messageDeveloper: string;
  };
  createdAt: string;
};
export interface SystemLogs {
  id: string;
  timestamp: string;
  type: string;
  category: string;
  message: string;
  analyzedMessage: string;
  details: string;
  severity: string;
}
const spliter = (ab: string) => {
  return ab.split(":")[0];
};
export function logMapper(data: ApiResponseLog[]): SystemLogs[] | [] {
  if (data?.length === 0) {
    return [];
  }
  return data?.map((res: ApiResponseLog) => ({
    id: res?.id,
    timestamp: spliter(res?.createdAt),
    type: res?.meta.type,
    category: res?.meta.category,
    message: res?.meta.message,
    analyzedMessage: res?.meta.messageDeveloper,
    details: res?.meta.messageDeveloper,
    severity: res?.meta.severity,
  }));
}
