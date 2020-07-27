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
      <a-button type="primary" html-type="submit">确定</a-button>
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
          console.log(values)
          this.parent.handleCancel()
        }
      });
    }
  },
};
</script>

<style>
</style>