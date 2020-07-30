<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="事件名称">
      <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入事件名称!' }] }]" />
    </a-form-item>
    <a-form-item label="事件时间">
      <a-date-picker
        v-decorator="['time', { rules: [{ required: true, message: '请选择事件时间!' }], initialValue: time } ]"
        @change="onChange"
      />
    </a-form-item>
    <a-form-item label="事件内容">
      <a-textarea
        :auto-size="{ minRows: 3, maxRows: 5 }"
        v-decorator="[
          'content',
          { rules: [{ required: true, message: '请输入事件内容!' }] }
        ]"
      />
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
    eventDate: {
      type: Object,
      defaule() {
        return {};
      },
    },
  },
  data() {
    return {
      dateString: '',
      time: null,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let date = this.eventDate.year + '-' + (this.eventDate.month+1) + '-' + this.eventDate.day
      this.time = moment(date)
      this.dateString = this.time.format().substr(0,10)
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
    postData(values) {
      let data = {
        project_id: this.work.id,
        // process_id: values.type,
        time_day: this.dateString,
        name: values.name,
        content: values.content
      };
      const url = 'json/post.json'
      this.axios.get(url, data).then((res) => {
        this.parent.getData();
        console.log(res);
      });
    },
  },
};
</script>

<style>
</style>