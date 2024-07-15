import { request } from '@/utils/service';

export function home() {
  return request({
    url: `/api/attack_ip/event_stat`,
    method: "get",
  });
}
export function banStat(params:object) {
  return request({
    url: `/api/attack_ip/ban_stat`,
    method: "get",
    params,
  });
}
