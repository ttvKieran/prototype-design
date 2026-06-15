# Hướng dẫn làm WebView để build APK Android bằng Jetpack Compose

Tài liệu này hướng dẫn cách đóng gói web hiện tại thành app Android APK bằng `WebView`, theo hướng **Jetpack Compose**.

Tài liệu này phù hợp với trường hợp:

- bạn tạo project Android Studio bằng template `Empty Activity`
- project Android **không có** file `activity_main.xml`
- UI Android đang viết bằng `Compose`

## 1. Cách làm phù hợp với project này

Với web hiện tại, cách ổn định nhất là:

1. Deploy web lên Vercel
2. Tạo app Android native mỏng bằng Jetpack Compose
3. Nhúng `WebView` vào Compose
4. Load URL production của web
5. Build APK

Luồng tổng quát:

```text
Web React + Vite
-> deploy Vercel
-> Android app Compose
-> WebView mở URL production
-> build APK
```

## 2. Vì sao không thấy `activity_main.xml`

Vì project Android của bạn đang dùng **Jetpack Compose**.

Khi dùng Compose:

- không cần `res/layout/activity_main.xml`
- không dựng UI bằng XML
- UI nằm trong `MainActivity.kt` hoặc các file composable khác

Nên trong hướng dẫn này:

- không dùng XML layout
- không tạo `activity_main.xml`

## 3. Điều kiện cần

- Web đã deploy được lên Vercel
- Có Android Studio
- Có Android SDK
- Có project Android Compose

Nếu chưa deploy web, xem:

[DEPLOY_VERCEL.md](/home/truongvu/Documents/vdt/design/DEPLOY_VERCEL.md)

## 4. URL nên dùng

App hiện tại bắt đầu từ màn hình đăng nhập, nên URL khuyến nghị là:

```text
https://your-project.vercel.app/auth
```

Không nên mở `/home` trực tiếp nếu muốn giữ flow đăng nhập đúng.

## 5. Cấp quyền Internet

Mở file:

```text
app/src/main/AndroidManifest.xml
``` 

Thêm dòng này phía trên `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Ví dụ:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:label="Ha Noi Flood Watch"
        android:supportsRtl="true"
        android:theme="@style/Theme.HaNoiFloodWatch">
        ...
    </application>
</manifest>
```

## 6. Tạo WebView trong Jetpack Compose

Vì dùng Compose, bạn sẽ nhúng `WebView` bằng `AndroidView`.

File cần sửa thường là:

```text
app/src/main/java/<package-name>/MainActivity.kt
```

## 7. MainActivity.kt mẫu hoàn chỉnh

Bạn có thể dùng mẫu này và thay `appUrl` bằng domain Vercel thật.

```kotlin
package com.example.hanoifloodwatch

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private val appUrl = "https://your-project.vercel.app/auth"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            WebViewScreen(
                url = appUrl,
                onWebViewCreated = { createdWebView ->
                    webView = createdWebView
                }
            )
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (::webView.isInitialized && webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun WebViewScreen(
    url: String,
    onWebViewCreated: (WebView) -> Unit
) {
    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                onWebViewCreated(this)

                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.cacheMode = WebSettings.LOAD_DEFAULT
                settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
                settings.allowFileAccess = true
                settings.allowContentAccess = true
                settings.loadsImagesAutomatically = true
                settings.builtInZoomControls = false
                settings.displayZoomControls = false
                settings.useWideViewPort = true
                settings.loadWithOverviewMode = true

                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): Boolean {
                        return false
                    }
                }

                webChromeClient = WebChromeClient()
                loadUrl(url)
            }
        }
    )
}
```

## 8. `javaScriptEnabled` và `domStorageEnabled` sửa ở đâu

Bạn hỏi đúng chỗ này nhiều người hay nhầm.

Hai dòng này:

```kotlin
settings.javaScriptEnabled = true
settings.domStorageEnabled = true
```

được sửa trong `MainActivity.kt`, bên trong chỗ tạo `WebView`.

Tức là sửa ở phần này:

```kotlin
WebView(context).apply {
    settings.javaScriptEnabled = true
    settings.domStorageEnabled = true
}
```

Chúng **không nằm trong code web React**.

## 9. Vì sao project này bắt buộc cần 2 dòng đó

Web hiện tại có:

- `React Router`
- `Leaflet`
- `toast`
- `fullscreen navigation`

Nên trong WebView phải bật:

```kotlin
settings.javaScriptEnabled = true
settings.domStorageEnabled = true
```

Nếu thiếu:

- React app có thể không render đúng
- Router hoạt động lỗi
- Leaflet có thể không chạy ổn
- state trình duyệt trong web chạy không đúng

## 10. `shouldOverrideUrlLoading()` sửa ở đâu

Cũng sửa trong `MainActivity.kt`.

Phần này nằm trong:

```kotlin
webViewClient = object : WebViewClient() {
    override fun shouldOverrideUrlLoading(
        view: WebView?,
        request: WebResourceRequest?
    ): Boolean {
        return false
    }
}
```

Ý nghĩa:

- `return false` = để link tiếp tục mở ngay trong WebView
- route nội bộ của web tiếp tục chạy trong app

Nếu không làm vậy, app có thể:

- mở link bằng trình duyệt ngoài
- hoặc xử lý route không như mong muốn

## 11. Xử lý nút Back là làm ở đâu

Cũng làm trong `MainActivity.kt`.

Đây là phần xử lý sau khi WebView đã được tạo:

```kotlin
onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
    override fun handleOnBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            finish()
        }
    }
})
```

Ý nghĩa:

- nếu WebView còn history thì back về trang trước
- nếu không còn history thì thoát app

Nếu không xử lý, bấm nút back của Android có thể thoát app ngay.

## 12. Có cần sửa gì trong project web này không

Không cần sửa gì thêm để chạy theo kiểu WebView mở URL production, ngoài việc:

- web đã deploy ổn
- route SPA đã hoạt động ổn trên Vercel

Project này đã có:

- `vercel.json`
- cấu hình phù hợp cho SPA routing

## 13. Build APK debug và release khác nhau gì

### Debug

Dùng để:

- test nhanh
- cài thử trên máy
- kiểm tra giao diện và luồng

Đặc điểm:

- build nhanh hơn
- không dùng để phát hành chính thức
- thường nằm ở:

```text
app/build/outputs/apk/debug/app-debug.apk
```

### Release

Dùng để:

- demo chính thức
- nộp sản phẩm
- phát hành bản cuối

Đặc điểm:

- cần ký app bằng `keystore`
- tối ưu hơn
- phù hợp để gửi người khác cài

Thường nằm ở:

```text
app/build/outputs/apk/release/
```

Tóm gọn:

- đang làm và test: `debug`
- bản cuối để nộp/demo: `release`

## 14. Build APK debug bằng lệnh

Nên đứng ở **thư mục gốc của project Android** rồi chạy lệnh.

### Nếu dùng macOS / Linux

```bash
./gradlew assembleDebug
```

### Nếu dùng Windows

```bash
gradlew.bat assembleDebug
```

APK debug thường nằm ở:

```text
app/build/outputs/apk/debug/app-debug.apk
```

Nếu muốn cài luôn vào máy/emulator đang kết nối:

### macOS / Linux

```bash
./gradlew installDebug
```

### Windows

```bash
gradlew.bat installDebug
```

## 15. Build APK release bằng lệnh

Muốn build `release`, project Android phải có cấu hình ký app (`signingConfig`) hoặc bạn phải ký sau.

### Cách phổ biến nhất

```bash
./gradlew assembleRelease
```

hoặc trên Windows:

```bash
gradlew.bat assembleRelease
```

APK release thường nằm ở:

```text
app/build/outputs/apk/release/app-release.apk
```

### Lưu ý rất quan trọng

Nếu chưa cấu hình signing, lệnh `assembleRelease` có thể:

- fail khi build
- hoặc tạo ra bản release chưa dùng để phát hành chính thức

Nên với bản nộp/demo chính thức, bạn thường cần thêm:

- `keystore`
- `keyAlias`
- `keyPassword`
- `storePassword`

trong cấu hình Gradle của project Android.

## 16. Build qua giao diện Android Studio

Nếu không muốn dùng lệnh, vẫn có thể build bằng menu:

- debug: `Build > Build APK(s)`
- release: `Build > Generate Signed Bundle / APK`

## 17. Checklist test

Sau khi build và cài APK, nên test:

1. App mở vào `/auth`
2. Đăng nhập user/admin bình thường
3. Trang map hiển thị đúng
4. Leaflet load bình thường
5. Popup GPS giả lập mở bình thường
6. Fullscreen navigation vẫn hiển thị đúng
7. Back Android hoạt động đúng
8. Không bị bật trình duyệt ngoài khi chuyển route trong app

## 18. Nếu app không hiện web

Kiểm tra theo thứ tự:

### 1. Thiếu Internet permission

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### 2. Chưa bật JavaScript

```kotlin
settings.javaScriptEnabled = true
```

### 3. Chưa bật DOM storage

```kotlin
settings.domStorageEnabled = true
```

### 4. URL Vercel sai

Ví dụ đúng:

```text
https://your-project.vercel.app/auth
```

### 5. Web chưa deploy xong

Hãy mở URL bằng Chrome trên điện thoại trước để xác nhận web chạy thật.

## 19. Khuyến nghị cho đồ án/demo

Với project hiện tại, hướng tốt nhất là:

1. Deploy web lên Vercel
2. Android app Compose chỉ làm nhiệm vụ mở WebView
3. Build debug để test
4. Build release để nộp/demo

Đây là cách ít rủi ro nhất.

## 20. Tóm tắt nhanh

### Phần web

```bash
npm install
npm run build
```

Deploy lên Vercel.

### Phần Android Compose

1. Thêm Internet permission
2. Mở `MainActivity.kt`
3. Tạo `WebView` bằng `AndroidView`
4. Bật:

```kotlin
settings.javaScriptEnabled = true
settings.domStorageEnabled = true
```

5. Giữ:

```kotlin
shouldOverrideUrlLoading(...) = false
```

6. Xử lý nút back bằng `webView.canGoBack()`
7. Build APK bằng:

```bash
./gradlew assembleDebug
```

hoặc:

```bash
./gradlew assembleRelease
```

## 21. Nếu muốn làm tiếp

Nếu cần, tôi có thể làm thêm 1 trong 2 việc:

1. Viết tiếp tài liệu `WEBVIEW_APK_GUIDE.md` có ảnh minh họa theo từng bước trong Android Studio
2. Tạo luôn một file `MainActivity.kt` mẫu riêng trong repo này để bạn copy thẳng sang project Android Compose
