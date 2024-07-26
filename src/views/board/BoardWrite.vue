<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div class="board-boardMemo">
      <input type="text" v-model="boardTitle" class="w3-input w3-border" placeholder="제목을 입력해주세요.">
      <input type="text" v-model="boardTeacher" class="w3-input w3-border" placeholder="작성자를 입력해주세요." v-if="idx === undefined">
    </div>
    <div class="board-boardMemo">
      <textarea id="" cols="30" rows="10" v-model="boardMemo" class="w3-input w3-border" style="resize: none;"></textarea>
    </div>
    <div class="board-boardFile">
      <v-container>
        <input id="file-selector" ref="file" type="file" @change="fnFileUpload">
        <button class="w3-button w3-round w3-gray" @click="upload">파일 업로드</button>
      </v-container>
    </div>
    <div class="common-buttons">
      <button type="submit" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div v-if="videoUrl">
      <video controls>
        <source :src="videoUrl" type="video/mp4">
      </video>
    </div>
    <div v-else>
      <p>Loading video...</p>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      requestBody: this.$route.query,
      idx: this.$route.query.idx,  
      boardTitle: '',
      boardTeacher: '',
      boardMemo: '',
      fileCode: '',
      file: null,
      videoUrl: '',
      isUploading: false,
      uploadMessage: ''
    }
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      if (this.idx !== undefined) {
        let serverUrl = this.$serverUrl || process.env.VUE_APP_API_BASE_URL;
        let apiUrl = serverUrl + '/board/' + this.idx;
        this.$axios.get(apiUrl, {
          params: this.requestBody
        }).then((res) => {
          this.boardTitle = res.data.boardTitle;
          this.boardTeacher = res.data.boardTeacher;
          this.boardMemo = res.data.boardMemo;
          this.fileCode = res.data.fileCode;
          this.fetchVideoUrl(this.fileCode);
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    fetchVideoUrl(fileCode) {
      let serverUrl = this.$serverUrl || process.env.VUE_APP_API_BASE_URL;
      axios.get(`${serverUrl}/get-video-url/${fileCode}`)
        .then(response => {
          this.videoUrl = response.data.url;
        })
        .catch(error => {
          console.error(error);
        });
    },
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: './list',
        query: this.requestBody
      });
    },
    fnView(boardNo) {
      this.requestBody.boardNo = boardNo;
      this.$router.push({
        path: './detail',
        query: this.requestBody
      });
    },
    fnSave() {
      let serverUrl = this.$serverUrl || process.env.VUE_APP_API_BASE_URL;
      let apiUrl = serverUrl + '/board';
      this.form = {
        "idx": this.idx,
        "boardTitle": this.boardTitle,
        "boardMemo": this.boardMemo,
        "boardTeacher": this.boardTeacher
      };
      if (this.idx === undefined) {
        //INSERT
        this.$axios.post(apiUrl, this.form)
        .then((res) => {
          alert('글이 저장되었습니다.');
          this.fnView(res.data.boardNo);
        }).catch((err) => {
          if (err.message.indexOf('Network Error') > -1) {
            alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.');
          }
        });
      } else {
        //UPDATE
        this.$axios.patch(apiUrl, this.form)
        .then((res) => {
          alert('글이 저장되었습니다.');
          this.fnView(res.data.boardNo);
        }).catch((err) => {
          if (err.message.indexOf('Network Error') > -1) {
            alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.');
          }
        });
      }
    },
    fnFileUpload() {
      this.file = this.$refs.file.files[0];
      console.log(this.file.name, "Test");
    },
    async upload() {
      if (!this.file) {
        alert('파일을 선택하세요');
        return;
      }
      try {
        const formData = new FormData();
        formData.append('file', this.file);
        console.log(formData.get('file')); // FormData 확인
        let serverUrl = this.$serverUrl || process.env.VUE_APP_API_BASE_URL;
        const response = await axios.post(`${serverUrl}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert(response.data.message);
        this.fetchVideoUrl(response.data.file.file_code);
      } catch (err) {
        console.error('Error uploading file:', err.response ? err.response.data : err.message);
        alert('파일 업로드 실패');
      }
    }
  }
}
</script>
<style scoped>
.board-list {
  padding: 20px;
}
.common-buttons {
  margin-bottom: 20px;
}
</style>
