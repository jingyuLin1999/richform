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
      :limit="field.limit"
      :disabled="field.disabled"
      :show-file-list="field.showFileList"
      :accept="field.accept"
      :before-remove="onBeforeRemove"
      :on-success="onSuccess"
      :on-remove="onRemoveSuccess"
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
      <div v-if="field.tips.length > 0" class="el-upload__tip" slot="tip">
        {{ field.tips }}
      </div>
      <!-- 查看详情 -->
      <div
        v-if="field.listType == 'picture-card'"
        slot="file"
        slot-scope="{ file }"
      >
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview">
            <i class="el-icon-zoom-in" @click="pictureCardPreview(file)"></i>
          </span>
          <span v-if="!field.disabled" class="el-upload-list__item-delete">
            <i class="el-icon-delete" @click="onBeforeRemove(file, true)"></i>
          </span>
        </span>
      </div>
    </Upload>
    <Dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </Dialog>
  </div>
</template>

<script>
import baseMixin from "./baseMixin";
import { Upload, Message, Button, Dialog } from "element-ui";
import { loadDict } from "../utils/index";

export default {
  mixins: [baseMixin],
  components: { Upload, Message, Button, Dialog },
  data() {
    return {
      header: {
        [sessionStorage.getItem("auth-key")]:
          sessionStorage.getItem("auth-value"),
      },
      fileList: [], // 刚开始显示的图片
      dialogVisible: false,
      dialogImageUrl: null,
    };
  },
  watch: {
    "field.listType"() {
      // 类型改变了，可能导致高度发生变化，需重新计算高度
      this.getWidgetHeight();
    },
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
        limit: 2, // 上传限制
        disabled: false,
        showFileList: true, // 是否显示已上传文件列表
        accept: "", // 可接受的类型 image/jpeg,image/gif,image/png,image/bmp
        mapValues: {
          // 将服务器返回值映射到values对应字段
          originalFilename: "filename", // 返回字段 value字段
          fileSize: "filesize",
        },
      };
    },
    pictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onFileList() {
      if (Array.isArray(this.value) && this.value.length > 0) {
        this.value.map((urlItem) => {
          let ramdomName = Math.random().toString(16).slice(2, 12);
          this.fileList.push({
            name: ramdomName + ".png",
            url: urlItem,
          });
        });
      }
    },
    onSuccess(response, file, fileList) {
      const { payload, msg, status } = response;
      console.log(payload, msg, status )
      if (status != 200) {
        Message({ type: "error", message: `上传失败，${msg}` });
        fileList.splice(fileList.length - 1, 1);
        return;
      }
      // 映射值
      for (let key in payload) {
        let mapValues = this.field.mapValues;
        let valuesKey = mapValues[key];
        if (valuesKey) this.values[valuesKey] = payload[key];
      }
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
    getRemoveParams(file) {
      let url = file.path || file.url;
      let reg =
        /^(?:([A-Za-z]+):)?(?:\/{0,3})([A-Zaz.\-0-9]+)(?::(\d+))?(\/[^#?]*)?(?:\?([^#]*))?(?:#(.*))?$/;
      let result = reg.exec(url);
      let arr = result[4].split("/");
      arr = arr.filter((item) => item != "");
      return { bucketName: arr[0], fileName: arr[1] };
    },
    onBeforeRemove(file, isManual = false) {
      return new Promise((resolve, reject) => {
        let rqData = this.getRemoveParams(file);
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
    onRemoveSuccess(file, fileList) {
      this.pickValues(fileList);
    },
  },
};
</script>

<style lang="scss">
.upload-widget {
  width: 100%;
  overflow: hidden;
}
</style>