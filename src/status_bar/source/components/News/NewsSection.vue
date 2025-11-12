<script lang="ts" setup>
import CommonStatus from '../common/CommonStatus.vue';

interface Props {
  /** 新闻标题 */
  title: string;
  /** 新闻内容 */
  content?: string | Record<string, string>;
  /** 空状态提示文本 */
  emptyMessage?: string;
  /** 标题样式类名 */
  titleClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  emptyMessage: '暂无内容',
  titleClass: '',
});

// 判断是否为新格式（对象格式）
const isNewFormat = computed(() => {
  return typeof props.content === 'object' && props.content !== null;
});

// 判断内容是否为空
const isEmpty = computed(() => {
  if (!props.content) return true;

  if (typeof props.content === 'string') {
    return props.content.trim() === '';
  }

  // 检查是否所有值都为空
  return Object.values(props.content).every(val => !val || val.trim() === '');
});

// 格式化新闻内容（旧格式：字符串）
const formattedContent = computed(() => {
  if (isEmpty.value) {
    return props.emptyMessage;
  }

  if (typeof props.content === 'string') {
    // 旧格式：将 | 符号替换为换行
    return props.content.replace(/\|/g, '\n');
  }

  return '';
});

// 获取新闻条目列表（新格式：对象）
const newsItems = computed(() => {
  if (!isNewFormat.value || isEmpty.value) {
    return [];
  }

  return Object.entries(props.content as Record<string, string>)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([key, value]) => ({
      title: key,
      content: value,
    }));
});
</script>

<template>
  <CommonStatus :title="title" variant="sub-section" :default-open="true" custom-class="news-section">
    <template #title>
      <span :class="titleClass">{{ title }}</span>
    </template>

    <!-- 旧格式：字符串内容 -->
    <div v-if="!isNewFormat" class="news-content value-main">
      {{ formattedContent }}
    </div>

    <!-- 新格式：对象格式（带小标题） -->
    <div v-else-if="!isEmpty" class="news-items">
      <div v-for="item in newsItems" :key="item.title" class="news-item">
        <div class="news-item-title">{{ item.title }}</div>
        <div class="news-item-content value-main">{{ item.content }}</div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="news-content value-main">
      {{ emptyMessage }}
    </div>
  </CommonStatus>
</template>

<style lang="scss" scoped>
.news-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: var(--theme-text-primary);
}

.news-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  &:not(:last-child) {
    padding-bottom: 12px;
    border-bottom: 1px solid var(--theme-border-secondary);
  }
}

.news-item-title {
  font-weight: 600;
  color: var(--theme-text-secondary);
  margin-bottom: 6px;
  font-size: 0.95em;
}

.news-item-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: var(--theme-text-primary);
  padding-left: 8px;
}
</style>
