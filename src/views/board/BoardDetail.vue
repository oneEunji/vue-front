<template>
  <div>
    <div v-if="videoUrl">
      <video controls>
        <source :src="videoUrl" type="video/mp4">
      </video>
    </div>
    <div v-else>
      <p>Loading video...</p>
    </div>
    <div class="board-detail">
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
      </div>
      <div class="board-memo">
        <h3>{{ board_title }}</h3>
        <div>
          <strong class="w3-large">{{ board_teacher }}</strong>
          <br>
        </div>
      </div>
      <div class="board-memo">
        <span>{{ board_memo }}</span>
      </div>
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      requestBody: this.$route.query,
      boardNo: this.$route.query.idx,
      board_title: '',
      board_teacher: '',
      board_memo: '',
      file_code: '',
      videoUrl: ''
    }
  },
  mounted() {
    this.fnGetView()
  },
  methods: {
    fnGetView() {
      let serverUrl= 'localhost:3001';
      if(!(this.$serverUrl)){
        serverUrl= 'localhost:3001';
      }else{
        serverUrl= this.$serverUrl;
      }
      axios.get(serverUrl + '/board/detail/' + this.boardNo, {
        params: this.requestBody
      }).then((res) => {
        this.board_title = res.data.board_title
        this.board_teacher = res.data.board_teacher
        this.board_memo = res.data.board_memo
        this.file_code = res.data.file_code
        this.fetchVideoUrl(res.data.file_code);
      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },
    fetchVideoUrl(fileCode) {
      let serverUrl= 'localhost:3001';
      if(!(this.$serverUrl)){
        serverUrl= 'localhost:3001';
      }else{
        serverUrl= this.$serverUrl;
      }
      axios.get(serverUrl + '/get-video-url/' + fileCode)
        .then(response => {
          this.videoUrl = response.data.url;
        })
        .catch(error => {
          console.error(error);
        });
    },
    fnList() {
      delete this.requestBody.board_no
      this.$router.push({
        path: './list',
        query: this.requestBody
      })
    },
    fnUpdate() {
      this.$router.push({
        path: './write',
        query: this.requestBody
      })
    },
    fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return
      let serverUrl= 'localhost:3001';
      if(!(this.$serverUrl)){
        serverUrl= 'localhost:3001';
      }else{
        serverUrl= this.$serverUrl;
      }
      axios.delete(serverUrl + '/board/' + this.board_no, {})
          .then(() => {
            alert('삭제되었습니다.')
            this.fnList();
          }).catch((err) => {
        console.log(err);
      })
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
