<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="项目名称">
      <a-input v-model="work.name" disabled="disabled" />
    </a-form-item>
    <a-form-item label="计划类型">
      <a-select
        v-decorator="[
          'type',
          { rules: [{ required: true, message: '请选择计划类型!' }], initialValue: item.id },
        ]"
        disabled="disabled"
      >
        <a-select-option
          v-for="(item, key) in processList"
          :key="key"
          :value="item.id"
        >{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="计划周期">
      <a-range-picker
        v-decorator="[
          'time',
          { rules: [{ required: true, message: '请选择计划周期!' }], initialValue: times },
        ]"
        @change="onChange"
        :locale="locale"
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
    <!-- <a-form-item label="修改记录">
      <div class="edit-list">
        <div class="flex" v-for="(ele, key) in item.edit" :key="key">
          <span>{{ ele.time }}</span>
          <span>{{ ele.owner }}</span>
        </div>
      </div>
    </a-form-item> -->
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" html-type="submit" style="margin-right: 60px;">确定</a-button>
      <a-popconfirm title="确定删除？" @confirm="del" ok-text="确定" cancel-text="取消" style="color: red">
        <a-icon slot="icon" type="question-circle-o" style="color: red" />
        <a>删除</a>
      </a-popconfirm>
    </a-form-item>
  </a-form>
</template>

<script>
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
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
    processList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      locale,
      times: null,
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
      this.times = [moment(this.item.interval_list.start_time_day), moment(this.item.interval_list.end_time_day)]
      this.dateString = [this.times[0].format().substr(0,10), this.times[1].format().substr(0,10)]
    },
    onChange(date, dateString) {
      console.log(date, dateString);
      this.dateString = dateString
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.postData(values);
        }
      });
    },
    handleSelectChange(value) {
      // this.form.setFieldsValue({
      //   note: `Hi, ${value === "male" ? "man" : "lady"}!`,
      // });
    },
    postData(values) {
      let data = {
        id: this.item.interval_list.id,
        project_id: this.item.interval_list.project_id,
        process_id: values.type,
        start_time_day: this.dateString[0],
        end_time_day: this.dateString[1],
        content: values.content
      }
      if (
        data.process_id !== this.item.interval_list.process_id ||
        data.start_time_day !== this.item.interval_list.start_time_day ||
        data.end_time_day !== this.item.interval_list.end_time_day ||
        data.content !== this.item.interval_list.content
      ) {
        const url = 'json/post.json'
        this.axios.get(url, data).then((res) => {
          this.parent.handleCancel();
          this.parent.getData();
        });
      }
    },
    del() {
      const url = 'json/post.json'
      this.axios.get(url, { id: this.item.interval_list.id }).then((res) => {
        this.parent.handleCancel();
        this.parent.getData();
      });
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