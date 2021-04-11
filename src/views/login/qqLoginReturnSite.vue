<template>
  <div></div>
</template>

<script>
import { getDatas } from "@/api/price/price-1/common";
import { getToken, setToken, removeToken } from "@/utils/auth";
export default {
  created() {
    const code = this.getQueryString("code");
    const state = this.getQueryString("state");
    if(state!==window.location.host) {
      window.location.href=`http://${state}/#/qqLoginReturnSite?code=${code}&state=${state}`
    }else {
      getDatas(
        { userType: 3, code: code, state: state },
        "/user/qqConfig/return"
      ).then((res) => {
        if (res.code === 1001) {
          const type = res.body.type;
          if (type === 1) {
            this.$message.success("请绑定已有账号");
            this.$store.commit("user/SET_OPEN_ID", res.body.qqOpenid);
            this.$router.push("/qqBindLogin");
          } else {
            setToken(res.body.token);
            this.$store.commit("user/SET_TOKEN", getToken());
            this.$router.push('/')
          }
        }
      });
    }
  },
  methods: {
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      console.log(window.location);
      const params = window.location.href.split("?")[1];
      if (!params) {
        return null;
      }
      const paramsArr = params.split("&");
      for (let index = 0; index < paramsArr.length; index++) {
        const data = paramsArr[index];
        if (data) {
          const splits = data.split("=");
          const key = splits[0];
          if (key == name) {
            return splits[1];
          }
        }
      }
      return null;
    },
  },
};
</script>