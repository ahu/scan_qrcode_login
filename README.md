scan_qrcode_login
=================

模拟实现微信扫描二维码登录PC网站
Login to a PC website by scan a qr code with an APP like wechat on your smartphone
![](https://web.archive.org/web/20130819173904/http://www.ekaay.com/Bilder/ekaayflowchart.jpg)
技术关键字(Keywords)：**Android APP QRcode nodejs comet**

--------------------------------------------------------

使用方法（Usage）：

1. 在你的安卓手机上安装QRCodeLoginClientAndroid.apk （Install the QRCodeLoginClientAndroid.apk）
2. 在你的服务器上启动服务端（Run the nodejs server）：node qr.js  注意：需要在防火墙上开放9999端口（Note: must let port 9999 open on your server firewall）
3. 使用浏览器打开如下网址，正常情况下你应该能看到一个二维码（Open the URL below and you'll see a QR code）：
   http://YOUR SERVER'S IP:9999/
4. 在手机上打开客户端，点右上角设置一下服务器地址为以上地址，然后保存（Set the server URL on the Android APP）。
5. 接下来先在手机客户端上登录，可以任意输入一个用户名（Then logined from APP with any username）。
6. 再下一步，点击“开始扫描”按钮扫一下第3步中打开的网页（And then click the "开始扫描" button to scan the QR code on step 3）。
7. 扫描后，页面上二维码下方会出现提示文字：已成功扫描，等待手机确认登录（You'll see words below the QR code which tell that you just scaned）。
8. 点击手机APP上的“我确认登录系统”按钮以确认第3步网页上的登录（Click the "我确认登录系统" button to confirm your login）。
9. 正常情况下，你会看到手机APP和PC网页上同时出现登录成功的提示（You'll login succeed）。至此，模拟实现微信扫描二维码登录PC网站的流程结束了:)
