(function() {
    const textShow = document.getElementById("textShow");
    const textShowText = ["启动中.", "码本播放器正常...", "加载视频中..."];
    let nowTextIndex = 0, nowTextInnerText = 0;
    const interval = setInterval(() => {
        if (textShowText.length <= nowTextIndex) nowTextIndex = 0;
        const nowString = textShowText[nowTextIndex];
        if (nowString.length <= nowTextInnerText) {
            textShow.innerText = '👻';
            nowTextIndex++; nowTextInnerText = 0;
        } else {
            textShow.innerText += nowString.charAt(nowTextInnerText++);
        }
    }, 200);

    const container = document.getElementById('player-container');
    const video = document.getElementById('video');
    const spinner = document.getElementById('spinner');
    const particlesCanvas = document.getElementById('particles');
    const menu = document.getElementById('context-menu');
    const errorRedirect = atob("aHR0cHM6Ly9iZWFyZGVkbWFuemhhby5naXRodWIuaW8vY29kZUJvb2tIYWl5YW5nQ21zTTN1OFBsYXllci9qcy9wbGF5ZXIvZXJyb3IuaHRtbA==");

    const params = new URLSearchParams(window.location.search);
    const srcUrl = params.get('url');
    if (!srcUrl) { window.location.href = errorRedirect; return; }

    container.addEventListener('click', () => {
        if (video.readyState < 1) window.open('https://codebook.ltd');
    });

    function isM3U8(url) { return url.toLowerCase().includes('.m3u8'); }
    try {
        if (isM3U8(srcUrl) && Hls.isSupported()) {
            const hls = new Hls(); hls.loadSource(srcUrl); hls.attachMedia(video);
        } else {
            video.src = srcUrl;
        }
    } catch (e) { window.location.href = errorRedirect; }

    video.addEventListener('loadedmetadata', () => {
        spinner.style.display = 'none';
        container.style.backgroundImage = 'none';
        video.style.visibility = 'visible';
        particlesCanvas.style.display = 'none';
        clearInterval(interval);
        video.addEventListener('pause', () => {
            if (video.paused) {
                // 暂停时显示菜单（居中）
                menu.style.display = 'block';
                menu.style.left = 'calc(50% - 80px)';
                menu.style.top = '0';
            }
        });
    });

    video.addEventListener('error', () => window.location.href = errorRedirect);

    const infoBtn = document.getElementById('info');
    const dlBtn = document.getElementById('download');
    const hidden = document.getElementById('hidden');

    // 视频信息功能
    infoBtn.addEventListener('click', () => {
        alert(`视频地址: ${srcUrl}\n分辨率: ${video.videoWidth}×${video.videoHeight}\n时长: ${Math.floor(video.duration)} 秒`);
        menu.style.display = 'none';
    });

    // 下载视频功能
    dlBtn.addEventListener("click", () => prompt("请复制下载链接", srcUrl));

    // 隐藏菜单
    hidden.addEventListener("click", () => menu.style.display = 'none');
    // 点击空白收起菜单
    document.addEventListener('click', e => {
        if (!menu.contains(e.target) && e.target.id !== 'play-pause') {
            menu.style.display = 'none';
        }
    });
})();