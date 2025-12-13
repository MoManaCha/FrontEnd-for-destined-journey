/**
 * MVU 变量框架 composable
 * 用于封装 MVU 变量的读写操作
 */

// 用于追踪 Mvu 初始化状态的 Promise
let mvuInitPromise: Promise<void> | null = null;

/**
 * 确保 Mvu 变量框架已初始化
 * 使用单例模式，只会初始化一次
 */
async function ensureMvuInitialized(): Promise<void> {
  if (mvuInitPromise === null) {
    mvuInitPromise = waitGlobalInitialized('Mvu').then(() => {
      // 初始化完成后不需要返回任何值
    });
  }
  return mvuInitPromise;
}

/**
 * 获取当前消息楼层的 MVU 数据
 */
export async function getMvuData(): Promise<Mvu.MvuData> {
  await ensureMvuInitialized();
  return Mvu.getMvuData({
    type: 'message',
    message_id: getCurrentMessageId(),
  });
}

/**
 * 更新命定之人的"是否在场"状态
 * @param characterName 角色名称
 * @param newValue 新状态值（保持原始类型：boolean 或 "是"/"否" 字符串）
 */
export async function setDestinyCharacterPresence(
  characterName: string,
  newValue: boolean | string,
): Promise<boolean> {
  try {
    const mvuData = await getMvuData();
    const path = `stat_data.命定系统.命定之人.${characterName}.是否在场`;

    // 使用 lodash 的 _.set 来更新变量
    _.set(mvuData, path, newValue);

    // 将更新后的数据写回消息楼层
    await Mvu.replaceMvuData(mvuData, {
      type: 'message',
      message_id: getCurrentMessageId(),
    });

    return true;
  } catch (error) {
    console.error('设置命定之人在场状态失败:', error);
    return false;
  }
}
