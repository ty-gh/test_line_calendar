document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    let selectedDateTime = null;

    // --- LIFF初期化 ---
    liff.init({
        liffId: "2007408982-8W0x1kq3" // ここにあなたのLIFF IDを貼り付けます
    })
    .then(() => {
        console.log('LIFF init succeeded.');
        // LIFFが初期化されたらカレンダーを有効にするなどの処理
        initializeCalendar();
    })
    .catch((err) => {
        console.error('LIFF init failed.', err);
        alert('LIFFの初期化に失敗しました。LINEアプリ内で開いてください。');
    });

    // --- カレンダー初期化 (Flatpickrの例) ---
    function initializeCalendar() {
        flatpickr("#datetime-picker", {
            enableTime: true,         // 時間選択を有効にする
            dateFormat: "Y-m-d H:i",  // 日時のフォーマット
            locale: "ja",             // 日本語化
            minDate: "today",         // 今日以降の日付を選択可能にする
            // 必要に応じて他のオプションを設定
            // 例: 1時間ごとの選択、特定の曜日を無効化など
            // minuteIncrement: 60,
            // disable: [
            //     function(date) {
            //         // 日曜日を無効化
            //         return (date.getDay() === 0);
            //     }
            // ],
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    selectedDateTime = selectedDates[0];
                    sendButton.disabled = false;
                    console.log("選択された日時:", dateStr);
                } else {
                    selectedDateTime = null;
                    sendButton.disabled = true;
                }
            }
        });
    }


    // --- 送信ボタンの処理 ---
    sendButton.addEventListener('click', () => {
        if (!liff.isLoggedIn() && !liff.isInClient()) {
            alert('LINEアプリ内で実行してください。');
            return;
        }

        if (selectedDateTime) {
            // ユーザーに表示するメッセージ形式
            const H = ('0' + selectedDateTime.getHours()).slice(-2);
            const i = ('0' + selectedDateTime.getMinutes()).slice(-2);
            const messageText = `予約希望日時: ${selectedDateTime.getFullYear()}年${selectedDateTime.getMonth() + 1}月${selectedDateTime.getDate()}日 ${H}:${i}`;

            liff.sendMessages([
                {
                    type: 'text',
                    text: messageText
                }
            ])
            .then(() => {
                console.log('Message sent');
                alert('日時を送信しました！');
                liff.closeWindow(); // LIFFウィンドウを閉じる
            })
            .catch((err) => {
                console.error('Send message error:', err);
                alert('メッセージの送信に失敗しました。');
            });
        } else {
            alert('日時を選択してください。');
        }
    });
});
