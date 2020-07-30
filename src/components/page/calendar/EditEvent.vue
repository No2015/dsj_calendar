<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="事件名称">
      <a-input
        v-decorator="['name', { rules: [{ required: true, message: '请输入事件名称!' }], initialValue: eventDetails.name }]"
      />
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
          { rules: [{ required: true, message: '请输入事件内容!' }], initialValue: eventDetails.content }
        ]"
      />
    </a-form-item>
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
import moment from "moment";
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
    eventDetails: {
      type: Object,
      defaule() {
        return {};
      },
    },
  },
  data() {
    return {
      dateString: "",
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
      this.time = moment(this.eventDetails.time_day);
      this.dateString = this.time.format().substr(0, 10);
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
        }
      });
    },
    postData(values) {
      let data = {
        id: this.eventDetails.id,
        project_id: this.work.id,
        // process_id: values.type,
        time_day: this.dateString,
        name: values.name,
        content: values.content,
      };
      if (
        data.name !== this.eventDetails.name ||
        data.content != this.eventDetails.content ||
        data.time_day !== this.eventDetails.time_day
      ) {
        const url = 'json/post.json'
        this.axios.get(url, data).then((res) => {
          this.parent.handleCancel();
          this.parent.getData();
          console.log(res);
        });
      }
    },
    del() {
      const url = 'json/post.json'
      this.axios.get(url, { id: this.eventDetails.id }).then((res) => {
        this.parent.handleCancel();
        this.parent.getData();
      });
    },
  },
};
</script>

<style>
</style>