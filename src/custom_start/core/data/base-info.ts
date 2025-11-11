import type { Attributes } from '../types';

export const GENDERS = ['男', '女', '雌性', '雄性', '自定义'] as const;

// 种族列表
export const RACES = [
  '地精',
  '人类',
  '兽族',
  '翼民',
  '矮人',
  '魔物',
  '女妖',
  '半身人',
  '亡灵种族',
  '深渊魔族',
  '巨人',
  '妖精',
  '精灵',
  '血族',
  '龙族',
  '自定义',
] as const;

// 身份列表
export const IDENTITIES = [
  '沦为奴隶',
  '魔王残党',
  '自由平民',
  '游荡亡灵',
  '野生魔物',
  '中产阶级',
  '贵族阶级',
  '自定义',
] as const;

export const START_LOCATIONS = [
  '大陆东南部区域-索伦蒂斯王国',
  '大陆东北部区域-诺斯加德联盟',
  '大陆东北部沿海区域-伯伦斯法环联邦-雾晶港',
  '大陆中东部区域-奥古斯提姆帝国',
  '大陆中央区域-神迹山脉-天空圣域高原-圣都梵尼亚',
  '大陆中西部区域-无尽风痕草原-卡拉什特里斯(兽族联盟)',
  '大陆西南端-翡翠之心-艾尔文海姆(精灵王国)',
  '大陆西南部区域-无尽树海-奥古斯提姆帝国-诺瓦·瓦伦蒂亚城',
  '大陆西南部区域-无尽树海-雨林中层区域',
  '大陆西南部区域-诺瓦尔河流域-主河道中游河底',
  '大陆西南部区域-无尽树海-雨林中央-无尽深渊地城-地下23层',
  '大陆南端-悲鸣沼泽-伯恩·瑞瑟喃斯(骸响之都)-城门内',
  '大陆上空-泣歌云海-艾琉德雷姆·尼尔(泣空遗迹)',
  '无尽海东部-碎星群岛-蓝泪岛',
  '自定义',
] as const;

// 属性列表
export const ATTRIBUTES: (keyof Attributes)[] = ['力量', '敏捷', '体质', '智力', '精神'];

// 等级相关常量
export const MAX_LEVEL = 10;
export const MIN_LEVEL = 1;

// 基础属性值
export const BASE_STAT = 4;

export const raceAttrs: Record<string, Attributes> = {
  地精: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  人类: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  兽族: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  翼民: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  矮人: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  精灵: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  亡灵种族: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  深渊魔族: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  巨人: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  妖精: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  血族: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  龙族: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  半身人: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
  女妖: { 力量: 0, 敏捷: 0, 体质: 0, 智力: 0, 精神: 0 },
};

/**
 * 根据等级计算可用的【额外】AP点数
 * @param level 角色等级
 * @returns 可自由分配的AP点数
 */
export const calculateAPByLevel = (level: number): number => {
  const baseAP = 5;

  // 额外属性点 = 等级 - 1
  const extraAP = Math.max(0, level - 1);

  return baseAP + extraAP;
};

/**
 * 获取等级对应的层级属性点
 * @param level 角色等级
 * @returns 每个属性获得的层级加成
 */
export const getTierAttributeBonus = (level: number): number => {
  if (level >= 1 && level <= 4) return 0;
  if (level >= 5 && level <= 8) return 1;
  if (level >= 9 && level <= 12) return 2;
  if (level >= 13 && level <= 16) return 3;
  if (level >= 17 && level <= 20) return 4;
  if (level >= 21 && level <= 24) return 5;
  if (level >= 25) return 6;
  return 0;
};

/**
 * 获取等级对应的层级名称
 * @param level 角色等级
 * @returns 层级名称
 */
export const getLevelTierName = (level: number): string => {
  if (level >= 1 && level <= 4) return '第一层级';
  if (level >= 5 && level <= 8) return '第二层级';
  if (level >= 9 && level <= 12) return '第三层级';
  if (level >= 13 && level <= 16) return '第四层级';
  if (level >= 17 && level <= 20) return '第五层级';
  if (level >= 21 && level <= 24) return '第六层级';
  if (level >= 25) return '第七层级';
  return '未知层级';
};
