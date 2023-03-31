<template>
  <div class="upload-widget" :id="widgetId">
    <div class="upload-type" v-if="field.showType">
      <span class="type-label" :style="{ color: colors.fontColor }"
        >上传类型：</span
      >
      <el-switch
        style="display: block"
        v-model="field.type"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="文件夹"
        inactive-text="文件"
        active-value="folder"
        inactive-value="file"
      >
      </el-switch>
    </div>
    <Upload
      ref="uploadWidget"
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
import {
  Upload,
  Message,
  Button,
  Dialog,
  Switch as elSwitch,
} from "element-ui";
import { loadDict } from "../utils/index";

export default {
  mixins: [baseMixin],
  components: { Upload, Message, Button, Dialog, elSwitch },
  data() {
    return {
      header: {
        [sessionStorage.getItem("richform-key")]:
          sessionStorage.getItem("richform-value"),
      },
      fileList: [], // 刚开始显示的图片
      dialogVisible: false,
      dialogImageUrl: null,
    };
  },
  mounted() {
    this.onFileList();
    this.onSwitchType();
  },
  watch: {
    "field.type"(newType) {
      this.onSwitchType(newType);
    },
  },
  methods: {
    defaultFieldAttr() {
      return {
        name: "file", // 上传文件字段名
        tips: "", // 提示
        type: "file", // folder|file
        showType: false, // 是否显示类型
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
    // 改变上传的是文件夹还是文件
    onSwitchType(newType = this.field.type) {
      let isFolder = newType == "folder";
      if (this.field.listType == "text") {
        this.$refs.uploadWidget.$children[0].$refs.input.webkitdirectory =
          isFolder;
      }
    },
    onFileList() {
      if (Array.isArray(this.value) && this.value.length > 0) {
        this.value.map((urlItem) => {
          // 后端生成的uuid文件名
          let filePath =
            urlItem.indexOf("?") == -1
              ? urlItem
              : urlItem.slice(0, urlItem.indexOf("?"));
          let fileName = filePath.slice(
            filePath.lastIndexOf("/") + 1,
            filePath.length
          );
          // 原始文件名
          let mapValues = this.field.mapValues;
          let originalFilename = mapValues.originalFilename;
          originalFilename = this.values[originalFilename];
          // 初始值
          this.fileList.push({
            name: originalFilename || fileName,
            url: urlItem,
          });
        });
      }
    },
    onSuccess(response, file, fileList) {
      const { payload, msg, status } = response;
      if (status != 200) {
        Message({ type: "error", message: `上传失败，${msg}` });
        fileList.splice(fileList.length - 1, 1);
        return;
      }
      Object.assign(file, payload);
      this.pickValues(fileList);
    },
    pickValues(fileList) {
      let pickPath = [],
        fileSize = 0,
        fileName = "";
      fileList.map((fileItem, index) => {
        let filesizeItem = fileItem.size || fileItem.fileSize;
        if (filesizeItem) fileSize += fileItem.size || fileItem.fileSize;
        fileName += fileItem.name || fileItem.fileName;
        if (index != fileList.length - 1) fileName += ",";
        pickPath.push(fileItem.path || fileItem.url);
      });
      // 设置值
      this.changeValue(pickPath);
      // 映射值
      let mapValues = this.field.mapValues;
      if (fileName) this.values[mapValues.originalFilename] = fileName;
      if (fileSize) this.values[mapValues.fileSize] = fileSize;
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
  .upload-type {
    display: flex;
    align-items: center;
    height: 23px;
    margin-bottom: 3px;
    .type-label {
      font-size: 12px;
    }
  }
}
</style>