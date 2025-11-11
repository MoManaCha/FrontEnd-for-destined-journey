<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useCharacterStore } from '../store';
import { generateAIPrompt, writeCharacterToMvu } from '../utils/data-exporter';
import Steps from './component/Steps.vue';

const router = useRouter();
const route = useRoute();
const characterStore = useCharacterStore();
const { character } = storeToRefs(characterStore);

const stepRef = ref<InstanceType<typeof Steps> | null>(null);
// 创建事件触发器
const randomGenerateTrigger = ref(0);
const resetPageTrigger = ref(0);

// 通过 provide 提供给子组件
provide('randomGenerateTrigger', randomGenerateTrigger);
provide('resetPageTrigger', resetPageTrigger);

// 随机生成当前页面内容
const handleRandomGenerate = () => {
  randomGenerateTrigger.value++;
};

// 重置当前页面内容
const handleReset = () => {
  resetPageTrigger.value++;
};

const stepTitles = ref([{ title: '信息/属性' }, { title: '装备/技能' }, { title: '对象/背景' }, { title: '确认' }]);

// 路由到步骤的映射
const routeToStep: Record<string, number> = {
  BasicInfo: 1,
  Selections: 2,
  Background: 3,
  Confirm: 4,
};

// 步骤到路由的映射
const stepToRoute: Record<number, string> = {
  1: 'BasicInfo',
  2: 'Selections',
  3: 'Background',
  4: 'Confirm',
};

// 从路由元信息或路由名获取当前步骤
const currentStep = computed(() => {
  const step = route.meta?.step as number;
  if (step) return step;

  const routeName = route.name as string;
  return routeToStep[routeName] || 1;
});

// 上一页
const handlePrevious = () => {
  const prevStep = currentStep.value - 1;
  if (prevStep >= 1) {
    const routeName = stepToRoute[prevStep];
    router.push({ name: routeName });
  }
};

// 下一页
const handleNext = async () => {
  // 如果是最后一步，执行"踏上旅程"逻辑
  if (currentStep.value === stepTitles.value.length) {
    await handleStartJourney();
    return;
  }

  // 否则跳转到下一步
  const nextStep = currentStep.value + 1;
  if (nextStep <= stepTitles.value.length) {
    const routeName = stepToRoute[nextStep];
    router.push({ name: routeName });
  }
};
// 踏上旅程
const handleStartJourney = async () => {
  try {
    // 1. 写入 MVU 变量
    await writeCharacterToMvu(
      character.value,
      characterStore.selectedItems,
      characterStore.selectedSkills,
      characterStore.selectedDestinedOnes,
    );
    console.log('✅ 角色数据已写入 MVU 变量');

    // 2. 生成 AI 提示词
    const aiPrompt = generateAIPrompt(
      character.value,
      characterStore.selectedEquipments,
      characterStore.selectedDestinedOnes,
      characterStore.selectedBackground,
      characterStore.selectedItems,
      characterStore.selectedSkills,
    );
    console.log('✅ AI 提示词已生成：\n', aiPrompt);

    // 3. 发送给 AI（使用 SillyTavern 的 triggerSlash 函数）

    // 使用 /send 命令发送 AI 提示词
    const sendCommand = `/send raw=true compact=false ${aiPrompt}`;
    await triggerSlash(sendCommand);

    console.log('✅ 角色信息已发送给 AI');
  } catch (error) {
    console.error('❌ 踏上旅程时发生错误：', error);
  }
};

// 判断是否可以点击上一页
const canGoPrevious = computed(() => currentStep.value > 1);

// 判断"踏上旅程"按钮是否应被禁用
const isNextButtonDisabled = computed(() => {
  return false;
});

// 下一步按钮文字
const nextButtonText = computed(() => {
  return currentStep.value === stepTitles.value.length ? '踏上旅程' : '下一步';
});

// 过渡动画方向
const transitionName = ref('slide-left');

// 监听路由变化，设置过渡方向
watch(
  () => route.name,
  (newRoute, oldRoute) => {
    const newStep = routeToStep[newRoute as string] || 1;
    const oldStep = routeToStep[oldRoute as string] || 1;

    // 根据步骤变化决定动画方向
    transitionName.value = newStep > oldStep ? 'slide-left' : 'slide-right';
  },
);
</script>

<template>
  <div class="layout">
    <h1 class="main-title">命定之诗与黄昏之歌</h1>

    <Steps ref="stepRef" :steps="stepTitles" :step="currentStep" />

    <!-- 随机生成和重置按钮（确认页面不显示） -->
    <div v-if="currentStep !== 4" class="action-buttons">
      <button class="action-button random-button" title="随机生成当前页面内容" @click="handleRandomGenerate">
        <span class="icon">✨</span>
        <span class="text">随机当前页</span>
      </button>
      <button class="action-button reset-button" title="重置当前页面" @click="handleReset">
        <span class="icon">🔄</span>
        <span class="text">重置当前页</span>
      </button>
    </div>

    <div class="content-area">
      <router-view v-slot="{ Component, route: slotRoute }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="slotRoute.path" />
        </transition>
      </router-view>
    </div>

    <div class="navigation">
      <button class="nav-button prev-button" :disabled="!canGoPrevious" @click="handlePrevious">
        <span class="text">上一步</span>
      </button>

      <button class="nav-button next-button" :disabled="isNextButtonDisabled" @click="handleNext">
        <span class="text">{{ nextButtonText }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  padding: var(--spacing-xl);
}

.main-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--title-color);
}

.content-area {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  min-height: 400px;
}

// 向左滑动过渡（前进）
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 向右滑动过渡（后退）
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
}

// 操作按钮组
.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  justify-content: center;
  margin-top: var(--spacing-md);
}

.action-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);

  .icon {
    font-size: 1.1rem;
  }

  &.random-button {
    background: linear-gradient(135deg, #e8d5c4 0%, #d4c4b0 100%);
    color: var(--title-color);

    &:hover {
      background: linear-gradient(135deg, #f0ddd0 0%, #e0d5c7 100%);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }

  &.reset-button {
    background: linear-gradient(135deg, #c6b8a5 0%, #b0a295 100%);
    color: var(--title-color);

    &:hover {
      background: linear-gradient(135deg, #d4c4b0 0%, #c6b8a5 100%);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
}

.nav-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--button-bg);
  color: var(--title-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:hover:not(:disabled) {
    background: var(--button-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--border-color-light);
    color: var(--text-light);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .layout {
    padding: var(--spacing-md);
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .navigation {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-button {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }

  .action-button {
    flex: 1;
  }
}
</style>
