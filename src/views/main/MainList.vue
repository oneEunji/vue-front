<template>
  <div class="main-list">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnWrite">등록</button>
    </div>
    <table class="w3-table-all">
      <thead>
      <tr>
        <th>No</th>
        <th>제목</th>
        <!-- <th>강의</th> -->
        <th>강사명</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, main_no) in list" :key="main_no">
        <td><a v-on:click="fnView(`${row.main_no}`)">{{ row.main_no }}</a></td>
                <!-- <td>
          <img v-if="row.thumbnail_url" :src="row.thumbnail_url" alt="썸네일 이미지" width="100">
          <div v-else style="width: 100px; height: 75px; background-color: #f0f0f0;"></div>
        </td> -->
        <td><a v-on:click="fnView(`${row.main_no}`)">{{ row.main_title }}</a></td>
        <td><a v-on:click="fnView(`${row.main_no}`)">{{ row.main_author }}</a></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() { //변수생성
    return {
      requestBody: {}, //리스트 페이지 데이터전송
      list: {}, //리스트 데이터
      no: '', //게시판 숫자처리
      keyword: this.$route.query.keyword,
    }
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      this.requestBody = { // 데이터 전송
        keyword: this.keyword,
        page: this.page,
        size: this.size
      }
      let serverUrl= process.env.VUE_APP_API_BASE_URL;
      if(!(this.$serverUrl)){
        serverUrl= process.env.VUE_APP_API_BASE_URL;
      }else{
        serverUrl= this.$serverUrl;
      }
      this.$axios.get(serverUrl + "/main/list", {
        params: this.requestBody,
        headers: {}
      }).then((res) => {      
        this.list = res.data  //서버에서 데이터를 목록으로 보내므로 바로 할당하여 사용할 수 있다.

      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },
    fnView(idx) {
      this.requestBody.mainNo = idx
      this.$router.push({
        path: './detail',
        query: this.requestBody
      })
    },
    fnWrite() {
      this.$router.push({
        path: './write'
      })
    }
  }
}
</script>