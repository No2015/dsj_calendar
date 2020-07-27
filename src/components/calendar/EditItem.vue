<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="项目名称">
      <a-input v-model="work.name" disabled="disabled" />
    </a-form-item>
    <a-form-item label="日程类型">
      <a-select
        v-decorator="[
          'type',
          { rules: [{ required: true, message: '请选择日程类型!' }], initialValue: item.type },
        ]"
        placeholder="日程类型"
        @change="handleSelectChange"
      >
        <a-select-option
          v-for="(item, key) in listHead"
          :key="key"
          :value="item.type"
        >{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="日程周期">
      <a-range-picker
        v-decorator="[
          'time',
          { rules: [{ required: true, message: '请选择日程周期!' }], initialValue: times },
        ]"
        @change="onChange"
      />
    </a-form-item>
    <a-form-item label="详情">
      <a-textarea
        :auto-size="{ minRows: 3, maxRows: 5 }"
        v-decorator="[
          'content',
          { initialValue: item.content },
        ]"
      />
    </a-form-item>
    <a-form-item label="修改记录">
      <div class="edit-list">
        <div class="flex" v-for="(ele, key) in item.edit" :key="key">
          <span>{{ ele.time }}</span>
          <span>{{ ele.owner }}</span>
        </div>
      </div>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" html-type="submit">确定</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    parent: {
      type: Object,
      default() {
        return {};
      },
    },
    work: {
      type: Object,
      default() {
        return {};
      },
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      times: null,
      listHead: [],
      dateString: [],
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.listHead = [
        {
          type: "prd",
          name: "PRD",
        },
        {
          type: "meeting",
          name: "会议",
        },
        {
          type: "ui",
          name: "UI",
        },
        {
          type: "dev",
          name: "开发",
        },
        {
          type: "test",
          name: "测试",
        },
        {
          type: "product",
          name: "交付",
        },
      ];
      this.times = [moment(this.item.time), moment(this.item.etime)]
    },
    onChange(date, dateString) {
      console.log(date, dateString);
      this.dateString = dateString
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(this.dateString)
          this.parent.handleCancel()
        }
      });
    },
    handleSelectChange(value) {
      // this.form.setFieldsValue({
      //   note: `Hi, ${value === "male" ? "man" : "lady"}!`,
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-list{
  line-height: 28px;
  padding: 0 8px;
  max-height: 112px;
  overflow: auto;
  background: #f6f9fa;
}
</style>