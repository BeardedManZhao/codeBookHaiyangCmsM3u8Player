(function() {
    const textShow = document.getElementById("textShow");
    const textShowText = ["启动中.", "码本播放器正常...", "加载视频中..."];
    let nowTextIndex = 0, nowTextInnerText = 0;
    const interval = setInterval(() => {
        if (textShowText.length <= nowTextIndex) {
            nowTextIndex = 0;
        }
        const nowString = textShowText[nowTextIndex];
        if (nowString.length <= nowTextInnerText) {
            textShow.innerText = '';
            nowTextIndex += 1;
            nowTextInnerText = 0;
        } else {
            textShow.innerText += nowString.charAt(nowTextInnerText++);
        }
    }, 200);

    const container = document.getElementById('player-container');
    const video = document.getElementById('video');
    const spinner = document.getElementById('spinner');
    const particlesCanvas = document.getElementById('particles');
    const menu = document.getElementById('context-menu');
    const infoBtn = document.getElementById('info');
    const dlBtn = document.getElementById('download');
    const errorRedirect = atob("aHR0cHM6Ly9iZWFyZGVkbWFuemhhby5naXRodWIuaW8vY29kZUJvb2tIYWl5YW5nQ21zTTN1OFBsYXllci9qcy9wbGF5ZXIvZXJyb3IuaHRtbA==");

    // 解析 URL 参数
    const params = new URLSearchParams(window.location.search);
    const srcUrl = params.get('url');
    if (!srcUrl) {
        // window.location.href = errorRedirect;
        return;
    }

    // 点击背景跳转
    container.addEventListener('click', () => {
        if (video.readyState < 1) {
            window.open('https://codebook.ltd');
        }
    });

    // 判断 m3u8 格式并播放
    function isM3U8(url) {
        return url.toLowerCase().includes('.m3u8');
    }
    if (isM3U8(srcUrl) && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(srcUrl);
        hls.attachMedia(video);
    } else {
        video.src = srcUrl;
    }

    // 视频加载完成后
    video.addEventListener('loadedmetadata', () => {
        // 隐藏加载图标与背景，显示视频
        spinner.style.display = 'none';
        container.style.backgroundImage = 'none';
        video.style.visibility = 'visible';
        particlesCanvas.style.display = 'none';
        clearInterval(interval);
    });

    // 播放错误处理
    video.addEventListener('error', () => {
        window.location.href = errorRedirect;
    });

    // 长按唤起菜单
    let pressTimer = null;
    function showMenu(x, y) {
        menu.style.top = y + 'px';
        menu.style.left = x + 'px';
        menu.style.display = 'block';
    }
    function hideMenu() {
        menu.style.display = 'none';
    }

    container.addEventListener('mousedown', e => {
        pressTimer = setTimeout(() => showMenu(e.clientX, e.clientY), 600);
    });
    container.addEventListener('mouseup', () => clearTimeout(pressTimer));
    container.addEventListener('mouseleave', () => clearTimeout(pressTimer));

    // 菜单功能
    infoBtn.addEventListener('click', () => {
        alert(`视频地址: ${srcUrl}\n分辨率: ${video.videoWidth}×${video.videoHeight}\n时长: ${Math.floor(video.duration)} 秒`);
        hideMenu();
    });
    dlBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = srcUrl;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        hideMenu();
    });

    // 点击空白收起菜单
    document.addEventListener('click', e => {
        if (!menu.contains(e.target)) {
            hideMenu();
        }
    });
})();