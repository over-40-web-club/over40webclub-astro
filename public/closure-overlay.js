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

    // 音声再生ボタンのクリックイベント
    audioPlayBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio
          .play()
          .then(function () {
            console.log('Audio started playing');
            audioPlayBtn.classList.add('playing');
          })
          .catch(function (err) {
            console.error('Failed to play audio:', err);
          });
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
