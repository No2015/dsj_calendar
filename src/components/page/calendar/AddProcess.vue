<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="计划名称">
      <a-input
        v-decorator="['name', { rules: [{ required: true, message: '请输入计划名称!' }] }]"
      />
    </a-form-item>
    <a-form-item label="计划步骤">
      <a-input
        v-decorator="['step', { rules: [{ required: true, message: '请输入计划步骤!' }] }]"
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
    }
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
          this.postData(values)
          this.parent.handleCancel()
        }
      });
    },
    postData(values){
      console.log(values)
      const url2 = 'json/post.json'
      this.axios.get(url2,values).then((res) => {
        this.parent.getData()
        console.log(res);
      });
    }
  },
};
</script>

<style>
</style>