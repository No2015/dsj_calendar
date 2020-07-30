<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="项目名称">
      <a-input
        v-decorator="['name', { rules: [{ required: true, message: '请输入项目名称!' }], initialValue: work.name }]"
      />
    </a-form-item>
    <a-form-item label="详情">
      <a-textarea
        :auto-size="{ minRows: 3, maxRows: 5 }"
        v-decorator="[
          'content',
          { initialValue: work.content },
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
  },
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.postData(values);
        }
      });
    },
    postData(values) {
      let data = {
        id: this.work.id,
        name: values.name,
        status: this.work.status,
      };
      if (data.name !== this.work.name) {
        const url = 'json/post.json'
        this.axios.get(url, data).then((res) => {
          this.parent.handleCancel();
          this.parent.getData();
        });
      }
    },
    del() {
      const url = 'json/post.json'
      this.axios.get(url, { id: this.work.id }).then((res) => {
        this.parent.handleCancel();
        this.parent.getData();
      });
    },
  },
};
</script>

<style>
</style>