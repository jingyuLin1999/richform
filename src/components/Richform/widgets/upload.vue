<template>
  <div class="upload-widget" :id="widgetId">
    <Upload
      :name="field.name"
      :list-type="field.listType"
      :file-list="fileList"
      :drag="field.draggable && field.listType == 'text'"
      :action="field.actions"
      :multiple="field.multiple"
      :auto-upload="field.autoUpload"
      :headers="header"
      :disabled="field.disabled"
      :show-file-list="field.showFileList"
      :on-change="getWidgetHeight"
      :before-remove="onBeforeRemove"
      :on-success="onSuccess"
      :on-remove="onRemove"
    >
      <Button v-if="field.listType == 'picture'" size="small" type="primary"
        >点击上传</Button
      >
      <i
        v-else-if="field.listType == 'picture-card'"
        slot="default"
        class="el-icon-plus"
      ></i>
      <div v-else-if="field.listType == 'text'">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <div v-if="field.tips.length>0" class="el-upload__tip" slot="tip">{{ field.tips }}</div>
    </Upload>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { Upload, Message, Button } from "element-ui";
import { loadDict } from "../utils/index";

export default {
  mixins: [baseMixin],
  components: { Upload, Message, Button },
  data() {
    return {
      header: {
        [sessionStorage.getItem("auth-key")]:
          sessionStorage.getItem("auth-value"),
      },
      fileList: [],
    };
  },
  mounted() {
    this.onFileList();
  },
  methods: {
    defaultFieldAttr() {
      return {
        name: "file", // 上传文件字段名
        tips: "", // 提示
        listType: "picture", // 可选 text/picture/picture-card
        actions: "http://127.0.0.1:8080/manage/minio/upload.do", // 上传路径
        deleteUrl: "http://127.0.0.1:8080/manage/minio/removeFile.do", // 删除路径
        draggable: true, // 是否可拖拽
        multiple: true, // 多选
        autoUpload: true, // 是否在选取文件后立即进行上传
        limit: 1, // 上传限制
        disabled: false,
        showFileList: true, // 是否显示已上传文件列表
      };
    },
    onFileList() {
      if (Array.isArray(this.value) && this.value.length > 0) {
        this.value.map((urlItem) => {
          let ramdomName = Math.random().toString(16).slice(2, 12);
          this.fileList.push({ name: ramdomName + ".png", url: urlItem });
        });
      }
    },
    onSuccess(response, file, fileList) {
      const { payload } = response;
      Object.assign(file, payload);
      this.pickValues(fileList);
    },
    pickValues(fileList) {
      const pickPath = [];
      fileList.map((pathItem) => {
        pickPath.push(pathItem.path || pathItem.url);
      });
      this.changeValue(pickPath);
    },
    onRemove(file, fileList) {
      this.pickValues(fileList);
    },
    getRemoveParams(file) {
      let url = file.path || file.url;
      let reg =
        /^(?:([A-Za-z]+):)?(?:\/{0,3})([A-Zaz.\-0-9]+)(?::(\d+))?(\/[^#?]*)?(?:\?([^#]*))?(?:#(.*))?$/;
      let result = reg.exec(url);
      let arr = result[4].split("/");
      arr = arr.filter((item) => item != "");
      return { bucketName: arr[0], fileName: arr[1] };
    },
    onBeforeRemove(file) {
      let rqData = this.getRemoveParams(file);
      return new Promise((resolve, reject) => {
        loadDict(this.field.deleteUrl, rqData)
          .then((response) => {
            setTimeout(() => {
              this.getWidgetHeight();
            }, 1300);
            if (response.status != 200) {
              Message({
                type: "error",
                message: `删除失败，${response.msg}`,
              });
              reject();
            }
            resolve();
          })
          .catch((error) => {
            reject();
          });
      });
    },
  },
};
</script>

<style lang="scss">
.upload-widget {
  width: 100%;
}
</style>