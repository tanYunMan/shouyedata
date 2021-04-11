<template>
  <div id="app">
    <!-- <keep-alive> -->
    <router-view />
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
  name: "App",
  // created() {
  //   (function browserRedirect(){
  //     var sUserAgent = navigator.userAgent.toLowerCase();
  //     var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad';
  //     var bIsIphone = sUserAgent.match(/iphone os/i) == 'iphone os';
  //     var bIsMidp = sUserAgent.match(/midp/i) == 'midp';
  //     var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
  //     var bIsUc = sUserAgent.match(/ucweb/i) == 'web';
  //     var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce';
  //     var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';
  //     var bIsAndroid = sUserAgent.match(/android/i) == 'android';
  //     if(bIsIpad || bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM || bIsAndroid ){
  //       // alert("111111111111")
  //       // this.widthData = '1100px'
  //     }
  //   })();
  // },
};
</script>
<style lang="scss">
body .el-table th.gutter {
  display: table-cell !important;
}
</style>
<style>
.faka-table-header th {
  /* background: #dbdbdb !important; */
  color: #515151;;
}

/* 设置输入框提示文字颜色 */
::-webkit-input-placeholder { /* WebKit browsers */
  color: gray !important;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: gray !important;
}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: gray !important;
}
.search-container .el-form {
  padding: 0;
}

.el-dialog__header {
    padding: 10px 20px !important;
}

.el-dialog__headerbtn {
    top: 15px !important;
}
.el-input__inner{
  padding: 2px;
  font-size: 13px;
}

.dir_project_box .el-checkbox__label {
  flex: 1;
  overflow: hidden;
  white-space: normal;
}
</style>
