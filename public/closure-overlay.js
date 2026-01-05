(function () {
  'use strict';

  console.log('Closure overlay script loaded');

  var STORAGE_KEY = 'over40_access_granted';
  var EXPIRY_MINUTES = 40;

  function init() {
    console.log('Init function called');

    var overlay = document.getElementById('closure-overlay');
    var ageInput = document.getElementById('age-input');
    var errorMessage = document.getElementById('error-message');
    var toggleBtn = document.getElementById('closure-toggle-btn');
    var audioPlayBtn = document.getElementById('audio-play-btn');

    if (!overlay || !ageInput || !errorMessage || !toggleBtn || !audioPlayBtn) {
      console.error('Elements not found:', {
        overlay: !!overlay,
        ageInput: !!ageInput,
        errorMessage: !!errorMessage,
        toggleBtn: !!toggleBtn,
        audioPlayBtn: !!audioPlayBtn,
      });
      setTimeout(init, 100); // 要素が見つからない場合は100ms後にリトライ
      return;
    }

    console.log('All elements found, setting up event listeners');

    // 音声プレイヤーの初期化
    var audio = new Audio('/audio/over40webclub_closing_message.mp3');
    audio.preload = 'auto'; // PWA環境での即座の再生のため、自動プリロード
    var isLoading = false;
    var originalButtonHTML = audioPlayBtn.innerHTML;

    // 音声読み込みエラー時の処理
    audio.addEventListener('error', function (e) {
      console.error('Audio loading error:', e);
      audioPlayBtn.innerHTML = originalButtonHTML;
      audioPlayBtn.disabled = false;
      isLoading = false;
      alert('音声ファイルの読み込みに失敗しました。ネットワーク接続を確認してください。');
    });

    // PWA環境でのスムーズな再生のため、事前に読み込みを開始
    // ユーザーがクリックした時点で再生可能な状態にする
    audio.load();

    // 音声再生ボタンのクリックイベント
    audioPlayBtn.addEventListener('click', function () {
      if (isLoading) {
        console.log('Already loading audio');
        return;
      }

      if (audio.paused) {
        // 読み込み状態を表示
        isLoading = true;
        audioPlayBtn.disabled = true;
        audioPlayBtn.innerHTML = '読み込み中...';

        // PWAでのユーザージェスチャーコンテキスト維持のため、
        // クリックイベント内で即座にplay()を試行
        var playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(function () {
              // 再生成功
              console.log('Audio started playing');
              audioPlayBtn.innerHTML = originalButtonHTML;
              audioPlayBtn.disabled = false;
              audioPlayBtn.classList.add('playing');
              isLoading = false;
            })
            .catch(function (err) {
              console.log('Initial play failed, loading audio first:', err.message);

              // 再生に失敗した場合（データ不足など）、ロードしてから再試行
              var onCanPlay = function () {
                audio.removeEventListener('canplaythrough', onCanPlay);

                // ロード完了後に再生を試行
                // 注: この時点ではユーザージェスチャーコンテキストが失われている可能性があるため、
                // ユーザーに再度クリックを促す必要がある場合がある
                audio
                  .play()
                  .then(function () {
                    console.log('Audio started playing after load');
                    audioPlayBtn.innerHTML = originalButtonHTML;
                    audioPlayBtn.disabled = false;
                    audioPlayBtn.classList.add('playing');
                    isLoading = false;
                  })
                  .catch(function (retryErr) {
                    console.error('Failed to play audio after load:', retryErr);
                    audioPlayBtn.innerHTML = originalButtonHTML;
                    audioPlayBtn.disabled = false;
                    isLoading = false;
                    // PWA環境ではユーザージェスチャーが必要なため、再度クリックを促す
                    alert('音声の準備ができました。もう一度ボタンをタップしてください。');
                    // 次回のクリックでは既にロード済みなので再生される
                  });
              };

              audio.addEventListener('canplaythrough', onCanPlay);
              audio.load();
            });
        }
      } else {
        audio.pause();
        audioPlayBtn.classList.remove('playing');
      }
    });

    // 音声が終了したらアニメーションを停止
    audio.addEventListener('ended', function () {
      audioPlayBtn.classList.remove('playing');
    });

    // 音声が一時停止されたらアニメーションを停止
    audio.addEventListener('pause', function () {
      audioPlayBtn.classList.remove('playing');
    });

    // Enterキーでの送信
    ageInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        var value = ageInput.value.trim();

        if (value === '' || isNaN(Number(value))) {
          errorMessage.textContent = '数値を入力してください。';
          ageInput.value = '';
          return;
        }

        var age = Number(value);

        if (age < 40) {
          errorMessage.textContent = '若すぎます。';
          ageInput.value = '';
          return;
        }

        errorMessage.textContent = '';
        var newAccessData = {
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAccessData));
        overlay.classList.add('hidden');
        toggleBtn.classList.remove('hidden');
        console.log('Access granted');
      }
    });

    ageInput.addEventListener('input', function () {
      errorMessage.textContent = '';
    });

    // 閉鎖ボタンクリック時の処理
    toggleBtn.addEventListener('click', function () {
      console.log('Closure button clicked!');
      localStorage.removeItem(STORAGE_KEY);
      overlay.classList.remove('hidden');
      toggleBtn.classList.add('hidden');
      ageInput.value = '';
      errorMessage.textContent = '';
      console.log('Overlay shown again');
    });

    console.log('Event listeners attached');

    // localStorageをチェック（イベントリスナー設定後に実行）
    var accessData = localStorage.getItem(STORAGE_KEY);
    if (accessData) {
      try {
        var data = JSON.parse(accessData);
        var now = Date.now();
        var elapsed = now - data.timestamp;
        var expiryMs = EXPIRY_MINUTES * 60 * 1000;

        if (elapsed < expiryMs) {
          overlay.classList.add('hidden');
          toggleBtn.classList.remove('hidden');
          console.log('Access granted from localStorage');
        } else {
          localStorage.removeItem(STORAGE_KEY);
          console.log('Access expired');
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
        console.error('Error parsing localStorage:', e);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
