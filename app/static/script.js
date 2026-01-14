document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('profileCanvas');
    const ctx = canvas.getContext('2d');
    const modal = document.getElementById('previewModal');
    
    // 画像の読み込み
    const templateImg = new Image();
    // ★注意: 同じフォルダにこの画像があることを確認してください
    templateImg.src = '../static/template.jpeg'; 

    // 都道府県データ
    const PREF_DATA = {
        hokkaido_tohoku: ["北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島"],
        kanto: ["東京", "神奈川", "千葉", "埼玉", "茨城", "栃木", "群馬"],
        chubu: ["愛知", "静岡", "岐阜", "三重", "山梨", "長野", "新潟", "富山", "石川", "福井"],
        kinki: ["大阪", "京都", "兵庫", "奈良", "滋賀", "和歌山"],
        chugoku: ["広島", "岡山", "山口", "鳥取", "島根"],
        shikoku: ["香川", "愛媛", "徳島", "高知"],
        kyushu_okinawa: ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"]
    };

    // 初期化処理
    const initSelects = () => {
        // 年齢
        const ageSel = document.getElementById('ageSelect');
        for (let i = 18; i <= 80; i++) ageSel.add(new Option(`${i}歳`, i));

        // 日付連動
        const mSel = document.getElementById('birthMonth');
        const dSel = document.getElementById('birthDay');
        for (let i = 1; i <= 12; i++) mSel.add(new Option(`${i}月`, i));

        mSel.addEventListener('change', () => {
            dSel.innerHTML = '<option value="">日</option>';
            if (!mSel.value) { dSel.disabled = true; return; }
            dSel.disabled = false;
            const days = new Date(2024, mSel.value, 0).getDate();
            for (let i = 1; i <= days; i++) dSel.add(new Option(`${i}日`, i));
        });
    };

    // 地域連動
    document.getElementById('areaSelect').addEventListener('change', (e) => {
        const prefSel = document.getElementById('prefSelect');
        const prefs = PREF_DATA[e.target.value] || [];
        prefSel.innerHTML = '<option value="">都道府県を選択</option>';
        prefs.forEach(p => prefSel.add(new Option(p, p)));
        prefSel.disabled = !prefs.length;
    });

    // タグ取得（スペース区切り）
    const getTags = (id) => {
        const val = document.getElementById(id).value;
        // 全角・半角スペースで分割し、空文字除去、最大5つまで
        return val.trim().split(/[\s　]+/).filter(Boolean).slice(0, 5);
    };

    // Canvas描画処理
 // Canvas描画処理
    const drawCard = () => {
        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 背景画像を描画
        ctx.drawImage(templateImg, 0, 0, 614, 868);

        // --- 名前（性別で色変え） ---
        
        // ★追加：性別を取得して色を分岐させる
        const gender = document.getElementById('genderSelect').value;

        if (gender === '男性') {
            ctx.fillStyle = "#007AFF"; // 男性なら青 (鮮やかなブルー)
        } else if (gender === '女性') {
            ctx.fillStyle = "#FF4081"; // 女性なら赤 (少しピンク寄りの赤で可愛く)
        } else {
            ctx.fillStyle = "#6b4a3a"; // それ以外（非公開など）はブラウン
        }

        ctx.font = "bold 22px 'Helvetica Neue', Arial, sans-serif";
        const name = document.getElementById('userName').value || "未入力";
        // ★名前を描画（ここで設定した色が使われます）
        ctx.fillText(name, 130, 196); 


        // --- 基本情報など（ここからは元の色に戻す） ---
        
        // ★追加：色をブラウンに戻す（これがないと全部青や赤になっちゃいます）
        ctx.fillStyle = "#6b4a3a"; 
        
        ctx.font = "bold 16px 'Helvetica Neue', Arial, sans-serif";
        
        // 地域
        const region = document.getElementById('prefSelect').value || "未入力";
        ctx.fillText(region, 120, 262);

        // 年齢
        const age = document.getElementById('ageSelect').value ? `${document.getElementById('ageSelect').value}歳` : "未入力";
        ctx.fillText(age, 410, 262);

        // 誕生日
        const m = document.getElementById('birthMonth').value;
        const d = document.getElementById('birthDay').value;
        const birth = (m && d) ? `${m}月${d}日` : "未入力";
        ctx.fillText(birth, 120, 322);

        // 職業
        const job = document.getElementById('jobInput').value || "未入力";
        ctx.fillText(job, 410, 322);

        // --- 3カラム (趣味・特技・タイプ) ---
        ctx.textAlign = "center"; // 中央揃え

        const drawList = (tags, xBase, yStart) => {
            let y = yStart;
            tags.forEach(tag => {
                ctx.fillText(tag, xBase, y);
                y += 28;
            });
        };

        // 趣味
        drawList(getTags('hobbyInput'), 115, 462);
        // 特技
        drawList(getTags('skillInput'), 312, 462);
        // タイプ
        drawList(getTags('likeInput'), 508, 462);

        // --- ひとこと ---
        ctx.textAlign = "left"; // 左揃えに戻す
        ctx.font = "18px 'Helvetica Neue', Arial, sans-serif";
        const msg = document.getElementById('messageInput').value || "よろしくお願いします！";
        
        // 折り返し処理
        const splitText = (text, maxWidth) => {
            let lines = [];
            let line = '';
            for (let i = 0; i < text.length; i++) {
                if (ctx.measureText(line + text[i]).width > maxWidth) {
                    lines.push(line);
                    line = text[i];
                } else {
                    line += text[i];
                }
            }
            lines.push(line);
            return lines;
        };
        
        const lines = splitText(msg, 520);
        let lineY = 710;
        lines.forEach(l => {
            ctx.fillText(l, 46, lineY);
            lineY += 26;
        });
    };

    // イベントリスナー設定
    const openModal = () => {
        drawCard();
        modal.showModal();
        // モーダルを開いた瞬間にスクロール位置をリセット
        document.querySelector('.modal-body').scrollTop = 0;
    };
    
    const closeModal = () => modal.close();

    document.getElementById('btnToPreview').addEventListener('click', openModal);
    document.getElementById('btnClosePreview').addEventListener('click', closeModal);
    document.getElementById('btnBack').addEventListener('click', closeModal);

    // 画像ダウンロード
    document.getElementById('btnCreate').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `profile_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        closeModal();
    });

    initSelects();
    
    // 画像読み込み完了を待つ（念のため）
    templateImg.onload = () => {
        console.log("Template Loaded");
    };
});