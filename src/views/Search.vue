<template>
  <div class="translator">
    <h2>JP Address Finder</h2>
    <el-row>
      <el-form ref="form" :model="target">
        <el-form-item label="市区町村">
          <el-input type="input" v-model="target.inputCity" placeholder="市区町村を入力してください。" />
        </el-form-item>
        <el-form-item label="それ以下">
          <el-input type="input" v-model="target.inputAddress" placeholder="市区町村以下を入力してください" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">検索</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <span>検索結果</span>
      <div v-for="searchResult in target"　v-bind:key="searchResult.id">
        {{ searchResult.zip }}, {{ searchResult.jp_city }}, {{ searchResult.jp_address}} </div>
      <div class="table">
        <el-table :data="target.searchResult">
          <el-table-column prop="jp_city" label="市区町村"></el-table-column>
          <el-table-column prop="jp_address" label="それ以下"></el-table-column>
        </el-table>
      </div>
    </el-row>
  </div>
</template>

<style scoped>
.translator {
  text-align: left;
}
</style>

<script lang="ts">
import Vue from "vue";
import axios, { AxiosResponse } from "axios";

// API 実行結果
class SearchResult {
  AddressList: Address[] = new Array<Address>();
}

class Address {
  id: number = 0;
  zip: string = "";
  prefecture: string = "";
  city: string = "";
  address: string = "";
  jp_prefecture: string = "";
  jp_city: string = "";
  jp_address: string = "";
}

// フォームデータ
class AddressForm {
  inputCity: string = "";
  inputAddress: string = "";
  searchResult: SearchResult = new SearchResult();
}

// ビューモデル
export default Vue.extend({
  data() {
    return {
      target: new AddressForm()
    };
  },
  methods: {
    // 翻訳ボタンクリック時のイベントハンドラ
    async onSubmit() {
      const searchResult = await this.invokeSearch(
        this.target.inputCity,
        this.target.inputAddress
      );
      this.target.searchResult.AddressList = searchResult;
    },

    // CData API Server への Get
    async invokeSearch(cityText: string, addressText: string): Promise<SearchResult> {
      const instance = axios.create({
        baseURL: "http://localhost:8080/apiserver/api.rsc",
        headers: {
          "x-cdata-authtoken": process.env.VUE_APP_CDATATOKEN
        }
      });
      const params =
        "city?" + 
        "$filter=" + 
        "contains(JP_City,'" + cityText + "')" +
        " AND " + 
        "contains(JP_Address,'" + addressText + "')";
      const res: AxiosResponse = await instance.get(params);

      console.log(res.data);

      return res.data;
    }
  }
});
</script>