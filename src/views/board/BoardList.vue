<template>
  <div class="board-list">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnWrite">등록</button>
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="connectWebSocket">WebSocket 연결</button>
    </div>
    <table class="w3-table-all">
      <thead>
      <tr>
        <th>No</th>
        <th>썸네일</th>
        <th>제목</th>
        <th>강사명</th>
        <th>상세내역</th>
        <th>작성일</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, idx) in list" :key="idx">
        <td><a v-on:click="fnView(`${row.board_no}`)">{{ idx + 1 }}</a></td>
        <td>
          <a v-on:click="fnView(`${row.board_no}`)">
          <img v-if="row.thumbnail_url" :src="row.thumbnail_url" alt="썸네일 이미지" width="100">
          <div v-else style="width: 100px; height: 75px; background-color: #f0f0f0;"></div>
          </a>
        </td>
        <td><a v-on:click="fnView(`${row.board_no}`)">{{ row.board_title }}</a></td>
        <td><a v-on:click="fnView(`${row.board_no}`)">{{ row.board_teacher }}</a></td>
        <td><a v-on:click="fnView(`${row.board_no}`)">{{ row.board_memo }}</a></td>
        <td><a v-on:click="fnView(`${row.board_no}`)">{{ row.board_CDT }}</a></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      requestBody: {}, 
      list: [], 
      keyword: this.$route.query.keyword,
      socket: null // WebSocket 객체를 저장할 변수 추가
    }
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      this.requestBody = { 
        keyword: this.keyword,
        page: this.page,
        size: this.size
      }
      let serverUrl= process.env.VUE_APP_API_BASE_URL;
      if(this.$serverUrl){
        serverUrl= this.$serverUrl;
      }
      axios.get(serverUrl + "/board/list", {
        params: this.requestBody,
        headers: {}
      }).then((res) => {     
        this.list = res.data;
      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      });
    },
    fnView(idx) {
      this.requestBody.boardNo = idx;
      this.$router.push({
        path: './detail',
        query: this.requestBody
      })
    },
    fnWrite() {
      this.$router.push({
        path: './write'
      })
    },
    connectWebSocket() {
      const socket = new WebSocket('ws://localhost:3001');
      // const socket = new WebSocket('ws://localhost:3001');

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      socket.onerror = (error) => {
        console.log('WebSocket error:', error);
      };

      // WebSocket 객체를 데이터 속성에 저장
      this.socket = socket;
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
