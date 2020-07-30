<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="项目名称">
      <a-input v-model="work.name" disabled="disabled" />
    </a-form-item>
    <a-form-item label="计划类型">
      <a-select
        v-decorator="[
          'type',
          { rules: [{ required: true, message: '请选择计划类型!' }] },
        ]"
        placeholder="计划类型"
        @change="handleSelectChange"
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
          { rules: [{ required: true, message: '请选择计划周期!' }] },
        ]"
        @change="onChange"
        :locale="locale"
      />
    </a-form-item>
    <a-form-item label="详情">
      <a-textarea
        :auto-size="{ minRows: 3, maxRows: 5 }"
        v-decorator="[
          'content'
        ]"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" html-type="submit">确定</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
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
    processList: {
      type: Array,
      defaule(){
        return []
      }
    }
  },
  data() {
    return {
      locale,
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
      console.log(this.processList)
    },
    onChange(date, dateString) {
      console.log(date, dateString);
      this.dateString = dateString;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.postData(values);
          // console.log(this.dateString);
          this.parent.handleCancel();
        }
      });
    },
    handleSelectChange(value) {
      // this.form.setFieldsValue({
      //   note: `Hi, ${value === "male" ? "man" : "lady"}!`,
      // });
    },
    postData(values){
      let data = {
        project_id: this.work.id,
        process_id: values.type,
        start_time_day: this.dateString[0],
        end_time_day: this.dateString[1],
        content: values.content
      }
      const url2 = 'json/post.json'
      this.axios.get(url2,data).then((res) => {
        this.parent.getData()
        console.log(res);
      });
    }
  },
};
</script>

<style>
</style>