import { request } from '@/utils/service';

export default {
  // ip封堵
  getIPPlugginList(params:object) {
    return request({
      url: `/api/attack_ip/list`,
      method: "get",
      params,
    });
  },
  attackIpCreate(params:object) {
    return request({
      url: `/api/attack_ip/create`,
      method: "post",
      data: params,
    });
  },
  // 审核
  checker(params:object, id:string) {
    return request({
      url: `/api/attack_ip/list/${id}/checker`,
      method: "put",
      data: params,
    });
  },
  // 复核
  reviewer(params:object, id:string) {
    return request({
      url: `/api/attack_ip/list/${id}/reviewer`,
      method: "put",
      data: params,
    });
  },
  // 封禁结果
  pluggingResult(id:string) {
    return request({
      url: `/api/attack_ip/list/${id}/result`,
      method: "get",
    });
  },
  // 防火墙IP封禁的IP结果
  queryNewHitCounts() {
    return request({
      url: `/api/attack_ip/query_new_hit_counts`,
      method: "get",
    });
  },
  // 单条防火墙IP封禁的IP数据
  fetchFireWallIpData(params:object) {
    return request({
      url: `/api/attack_ip/query_closure_info_by_firewall`,
      method: "get",
      params
    });
  },
  // 单条防火墙IP封禁的IP数据
  getFirewallBanip(params:object) {
    return request({
      url: `/api/attack_ip/firewall_ban_info`,
      method: "get",
      params
    });
  },
  getrRportInfo() {
    return request({
      url: `/api/attack_ip/report_info`,
      method: "get",
    });
  },
  getrFirewallHitInfo(params:object) {
    return request({
      url: `/api/attack_ip/firewall_hit_info`,
      method: "get",
      params
    });
  },
  getFirewallChartsInfo(params:object) {
    return request({
      url: `/api/attack_ip/firewall_ban_stat`,
      method: "get",
      params
    });
  },
  getFirewallHitCharts(params:object) {
    return request({
      url: `/api/attack_ip/firewall_hit_stat`,
      method: "get",
      params
    });
  },
};

