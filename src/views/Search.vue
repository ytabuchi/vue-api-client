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
      <div>
        <el-table :data="target.searchResult">
          <el-table-column prop="Zip" label="郵便番号"></el-table-column>
          <el-table-column prop="JP_Prefecture" label="都道府県"></el-table-column>
          <el-table-column prop="JP_City" label="市区町村"></el-table-column>
          <el-table-column prop="JP_Address" label="それ以下"></el-table-column>
          <el-table-column prop="Prefecture" label="Prefecture"></el-table-column>
          <el-table-column prop="City" label="City"></el-table-column>
          <el-table-column prop="Address" label="Address"></el-table-column>
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
class Address {
  Id: number = 0;
  Zip: string = "";
  Prefecture: string = "";
  City: string = "";
  Address: string = "";
  JP_Prefecture: string = "";
  JP_City: string = "";
  JP_Address: string = "";
}

// フォームデータ
class AddressForm {
  inputCity: string = "";
  inputAddress: string = "";
  searchResult: Address[] = new Array<Address>();
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
      const res = await this.invokeSearch(
        this.target.inputCity,
        this.target.inputAddress
      );
      this.target.searchResult = res;
    },

    // CData API Server への Get
    async invokeSearch(cityText: string, addressText: string): Promise<Address[]> {
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

      console.log(res.data.value);
      return res.data.value;
    }
  }
});
</script>