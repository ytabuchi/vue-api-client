<template>
  <div class="translator">
    <h2>Translatorの実装</h2>
    <el-row :gutter="40">
      <el-col :span="12">
        <el-form ref="form" :model="target">
          <el-form-item label="翻訳するテキスト">
            <el-input
              type="textarea"
              rows="8"
              v-model="target.inputText"
              placeholder="翻訳するテキストを入力して下さい"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">翻訳</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <span>翻訳結果</span>
        <ul>
          <li>入力された言語: ja</li>
          <li>翻訳された言語: {{ target.searchResult.to }}</li>
          <li>翻訳結果:
            <div>
              {{ target.searchResult.text }}
            </div>
          </li>
        </ul>
      </el-col>
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

/*
target.searchResult.detectedLanguage
target.searchResult.translatedLanguage
target.searchResult.translatedText
*/

// API 実行結果
class SearchResult {
  address: Address[] = new Array<Address>();
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
  inputText: string = "";
  searchResult: SearchResult = new SearchResult();
}

// ビューモデル
export default Vue.extend({
  data() {
    return {
      target: new AddressForm
    (),
    };
  },
  methods: {
    // 翻訳ボタンクリック時のイベントハンドラ
    async onSubmit() {
      if (this.target.inputText) {
        const searchResult = await this.invokeSearch(
          this.target.inputText
        );
        this.target.searchResult = searchResult;
      }
    },

    // CData API Server への Get
    async invokeSearch(text: string): Promise<SearchResult> {
      const instance = axios.create({
        baseURL: 'http://localhost:8080/apiserver/api.rsc',
        headers: {
          "x-cdata-authtoken": process.env.VUE_APP_CDATATOKEN
        }
      });
      const params = "city?$filter=contains(JP_Address,'" + text + "')";
      const res: AxiosResponse = await instance.get(params);

      console.log(res.data);

      return res.data.value;
    }
  }
});
</script>